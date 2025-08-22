
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { Contact } from "@/pages/Contacts";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "import" | "export";
  selectedContacts?: string[];
  contacts?: Contact[];
  onImportComplete?: () => void;
}

export const ImportExportDialog = ({ 
  open, 
  onOpenChange, 
  mode,
  selectedContacts = [],
  contacts = [],
  onImportComplete
}: ImportExportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeAllFields, setIncludeAllFields] = useState(true);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();

  // Robust CSV parser with handling for quoted fields, whitespace, and edge cases
  function parseCSV(csvText: string): Record<string, string>[] {
    const lines = csvText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .filter(line => line.trim());
    if (lines.length === 0) return [];
    // Split on comma, respect quoted commas
    const CSV_REGEX = /("([^"]|"")*"|[^,]*)/g;
    const parseLine = (line: string) =>
      line.match(CSV_REGEX)?.map(col => {
        let v = col.trim();
        if (v.startsWith(",")) v = v.slice(1);
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/""/g, '"');
        return v;
      }).filter(Boolean) || [];

    const rawHeaders = parseLine(lines[0]);
    const headers = rawHeaders.map(h => h.toLowerCase().replace(/\s+/g, ""));
    const data: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const row = parseLine(lines[i]);
      if (row.length === 0) continue;
      const obj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        obj[header] = (row[idx] || "").trim();
      });
      data.push(obj);
    }
    return data;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file || !currentUser || !currentSubAccount) return;

    setIsProcessing(true);

    try {
      const text = await file.text();
      if (!text.trim()) throw new Error("Empty file");
      const rawRows = parseCSV(text);

      if (rawRows.length === 0) {
        toast({
          title: "Import Error",
          description: "CSV appears empty or invalid, please check the file.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Fetch existing emails to skip duplicates
      const existingSnapshot = await getDocs(
        query(
          collection(db, 'contacts'),
          where('subAccountId', '==', currentSubAccount.id)
        )
      );
      const existingEmails = new Set(existingSnapshot.docs.map(doc => (doc.data().email || "").trim().toLowerCase()));

      let importedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      for (const row of rawRows) {
        // Normalize possible field keys for common CSVs
        const getField = (...keys: string[]) =>
          keys.map(k => k.toLowerCase().replace(/\s+/g, "")).reduce((v, k) => v || row[k], "");
        
        const firstName = getField("firstname", "first_name", "first name").trim();
        const lastName = getField("lastname", "last_name", "last name").trim();
        const name = getField("name", "fullname", "full name").trim();
        const email = getField("email").trim().toLowerCase();
        const phone = getField("phone", "phonenumber", "phone number");
        const company = getField("company", "organization");
        const tagsString = getField("tags");
        const tags = tagsString ? tagsString.split(";").map(t => t.trim()).filter(Boolean) : [];
        const status = getField("status") || "new";
        const leadSource = getField("leadsource", "lead source") || "Import";
        const scoreRaw = getField("score");
        const score = scoreRaw && !Number.isNaN(Number(scoreRaw)) ? Number(scoreRaw) : Math.floor(Math.random() * 100);

        // Handle name splitting if only full name is provided
        let finalFirstName = firstName;
        let finalLastName = lastName;
        if (!firstName && !lastName && name) {
          const nameParts = name.split(' ');
          finalFirstName = nameParts[0] || '';
          finalLastName = nameParts.slice(1).join(' ') || '';
        }

        // Validation: Name & email required, skip duplicates if flagged
        if (!finalFirstName && !finalLastName && !name) {
          errorCount++;
          continue;
        }
        if (!email) {
          errorCount++;
          continue;
        }
        if (skipDuplicates && existingEmails.has(email)) {
          skippedCount++;
          continue;
        }
        
        // Import contact
        const contactData = {
          firstName: finalFirstName,
          lastName: finalLastName,
          email,
          phone,
          company,
          tags,
          status,
          leadSource,
          score,
          customFields: {},
          activities: [],
          subAccountId: currentSubAccount.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser.uid
        };
        
        try {
          await addDoc(collection(db, 'contacts'), contactData);
          existingEmails.add(email); // To prevent re-import in same batch
          importedCount++;
        } catch (e) {
          errorCount++;
        }
      }

      toast({
        title: "Import Complete",
        description: `${importedCount} contacts imported successfully. ${skippedCount} duplicates skipped.${errorCount > 0 ? ` ${errorCount} rows had errors.` : ""}`,
        variant: errorCount > 0 ? "destructive" : "default"
      });

      onImportComplete?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import contacts. Please check your CSV format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!currentUser || !currentSubAccount) return;
    
    setIsProcessing(true);
    
    try {
      let exportContacts = contacts;
      
      // If specific contacts are selected, filter to those
      if (selectedContacts.length > 0) {
        exportContacts = contacts.filter(c => selectedContacts.includes(c.id));
      }
      
      // If no contacts passed in, fetch from Firebase
      if (exportContacts.length === 0) {
        const snapshot = await getDocs(
          query(
            collection(db, 'contacts'),
            where('subAccountId', '==', currentSubAccount.id)
          )
        );
        exportContacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      }
      
      if (exportFormat === 'csv') {
        const headers = ['name', 'email', 'phone', 'company', 'status', 'leadSource', 'tags', 'score'];
        const csvContent = [
          headers.join(','),
          ...exportContacts.map(contact => 
            headers.map(header => {
              const value = contact[header as keyof Contact];
              if (header === 'tags' && Array.isArray(value)) {
                return `"${value.join(';')}"`;
              }
              return `"${value || ''}"`;
            }).join(',')
          )
        ].join('\n');
        
        downloadCSV(csvContent, `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      }
      
      toast({
        title: "Export Complete",
        description: `${exportContacts.length} contacts exported successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Error",
        description: "Failed to export contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "import" ? (
              <>
                <Upload className="h-5 w-5" />
                Import Contacts
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Export Contacts
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "import" 
              ? "Upload a CSV file to import your contacts into the system."
              : selectedContacts.length > 0 
                ? `Export ${selectedContacts.length} selected contacts to a file.`
                : "Export all your contacts to a file."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "import" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="file-upload">Choose CSV File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                {file && (
                  <p className="text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  CSV should include columns: firstName, lastName (or name), email, phone, company, status, leadSource, tags (semicolon separated)
                </AlertDescription>
              </Alert>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="skip-duplicates"
                  checked={skipDuplicates}
                  onCheckedChange={(checked) => setSkipDuplicates(checked === true)}
                />
                <Label htmlFor="skip-duplicates" className="text-sm">
                  Skip duplicate contacts (based on email address)
                </Label>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-all-fields"
                  checked={includeAllFields}
                  onCheckedChange={(checked) => setIncludeAllFields(checked === true)}
                />
                <Label htmlFor="include-all-fields" className="text-sm">
                  Include all fields and metadata
                </Label>
              </div>

              {selectedContacts.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have {selectedContacts.length} contacts selected for export.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          {mode === "import" ? (
            <Button onClick={handleImport} disabled={!file || isProcessing}>
              {isProcessing ? "Importing..." : "Import Contacts"}
            </Button>
          ) : (
            <Button onClick={handleExport} disabled={isProcessing}>
              {isProcessing ? "Exporting..." : "Export Contacts"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
