
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { saasSettingsService, SaasSettings } from '@/services/saasSettingsService';
import { toast } from 'sonner';

export const useSaasSettings = () => {
  const { currentSubAccount } = useSubAccount();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Query for SAAS settings
  const {
    data: saasSettings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['saasSettings', currentSubAccount?.id],
    queryFn: () => {
      if (!currentSubAccount?.id) return null;
      return saasSettingsService.getSaasSettings(currentSubAccount.id);
    },
    enabled: !!currentSubAccount?.id,
  });

  // Mutation for updating SAAS settings
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Omit<SaasSettings, 'id' | 'saasId' | 'email' | 'createdAt'>>) => {
      if (!currentSubAccount?.id) throw new Error('No sub-account selected');
      await saasSettingsService.updateSaasSettings(currentSubAccount.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saasSettings', currentSubAccount?.id] });
      toast.success('SAAS settings updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update SAAS settings:', error);
      toast.error('Failed to update SAAS settings');
    },
  });

  // Mutation for creating default settings
  const createDefaultMutation = useMutation({
    mutationFn: async () => {
      if (!currentSubAccount?.id || !currentUser?.uid) throw new Error('Missing required data');
      await saasSettingsService.createDefaultSettings(currentSubAccount.id, currentSubAccount, currentUser.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saasSettings', currentSubAccount?.id] });
      toast.success('SAAS settings initialized');
    },
    onError: (error) => {
      console.error('Failed to create default SAAS settings:', error);
      toast.error('Failed to initialize SAAS settings');
    },
  });

  const updateSaasSettings = async (data: Partial<Omit<SaasSettings, 'id' | 'saasId' | 'email' | 'createdAt'>>) => {
    await updateMutation.mutateAsync(data);
  };

  const createDefaultSettings = async () => {
    await createDefaultMutation.mutateAsync();
  };

  return {
    saasSettings,
    isLoading,
    error,
    updateSaasSettings,
    createDefaultSettings,
    isUpdating: updateMutation.isPending,
    isCreating: createDefaultMutation.isPending,
    refetch
  };
};
