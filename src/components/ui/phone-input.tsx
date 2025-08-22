import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { cn } from '@/lib/utils';

interface CustomPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: string;
}

export const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value = '',
  onChange,
  onCountryChange,
  placeholder = 'Enter phone number',
  disabled = false,
  className,
  defaultCountry = 'us',
}) => {
  // Detect country from phone number if it starts with +
  const getCountryFromPhone = (phoneNumber: string) => {
    if (!phoneNumber || !phoneNumber.startsWith('+')) return defaultCountry;
    
    // Common country codes mapping
    const countryCodeMap: { [key: string]: string } = {
      '+1': 'us',
      '+91': 'in',
      '+44': 'gb',
      '+49': 'de',
      '+33': 'fr',
      '+86': 'cn',
      '+81': 'jp',
      '+55': 'br',
      '+61': 'au',
      '+7': 'ru',
    };
    
    // Try to match the longest country code first
    for (const [code, country] of Object.entries(countryCodeMap)) {
      if (phoneNumber.startsWith(code)) {
        return country;
      }
    }
    
    return defaultCountry;
  };

  // Clean the phone number value - handle the + prefix properly
  const cleanValue = value.startsWith('+') ? value.slice(1) : value;
  const detectedCountry = getCountryFromPhone(value);

  const handlePhoneChange = (phone: string, countryData: any) => {
    // Always include the + prefix for international format
    const formattedPhone = phone ? `+${phone}` : '';
    onChange?.(formattedPhone);
    
    // Notify country change
    if (onCountryChange && countryData?.countryCode) {
      onCountryChange(countryData.countryCode.toUpperCase());
    }
  };

  return (
    <div className={cn('phone-input-wrapper', className)}>
      <PhoneInput
        country={detectedCountry} // Use detected country
        value={cleanValue}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        disabled={disabled}
        enableSearch={true}
        disableSearchIcon={false}
        countryCodeEditable={true} // Allow editing country code
        specialLabel=""
        autoFormat={true} // Enable auto-formatting
        enableAreaCodes={true} // Enable area codes for better detection
        inputProps={{
          name: 'phone',
          required: false,
          autoFocus: false,
        }}
        containerStyle={{
          width: '100%',
        }}
        inputStyle={{
          width: '100%',
          height: '40px',
          fontSize: '14px',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'calc(var(--radius) - 2px)',
          paddingLeft: '48px',
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        }}
        buttonStyle={{
          border: '1px solid hsl(var(--border))',
          borderRight: 'none',
          borderRadius: 'calc(var(--radius) - 2px) 0 0 calc(var(--radius) - 2px)',
          backgroundColor: 'hsl(var(--background))',
          height: '40px',
        }}
        dropdownStyle={{
          backgroundColor: 'hsl(var(--popover))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'calc(var(--radius) - 2px)',
          color: 'hsl(var(--popover-foreground))',
          zIndex: 9999,
        }}
        searchStyle={{
          margin: '8px',
          padding: '8px 12px',
          backgroundColor: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'calc(var(--radius) - 2px)',
          color: 'hsl(var(--foreground))',
        }}
        preferredCountries={['us', 'ca', 'gb', 'au', 'de', 'fr', 'in', 'cn', 'jp', 'br']}
        priority={{
          'us': 0, 'ca': 1, 'gb': 2, 'au': 3, 'de': 4, 'fr': 5, 'in': 6, 'cn': 7, 'jp': 8, 'br': 9
        }}
        enableLongNumbers={true} // Enable long numbers
        disableCountryCode={false} // Allow country code in input
      />
    </div>
  );
};

export { CustomPhoneInput as PhoneInput };
export default CustomPhoneInput;