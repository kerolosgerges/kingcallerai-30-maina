/**
 * Service Registry - Core services only (Contacts & File Manager)
 * Optimized for speed with minimal service loading
 */

import { ContactService } from './contactService';


class ServiceRegistry {
  private services: Map<string, any> = new Map();

  // Contact Services (CRUD)
  get contactService() {
    if (!this.services.has('contactService')) {
      this.services.set('contactService', new ContactService());
    }
    return this.services.get('contactService');
  }

  // Clear all services (useful for testing)
  clearAll() {
    console.log('🗑️ ServiceRegistry: Clearing all services');
    this.services.clear();
  }
  
  // Clear specific service
  clearService(serviceName: string) {
    console.log(`🗑️ ServiceRegistry: Clearing ${serviceName}`);
    this.services.delete(serviceName);
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistry();

// Export individual service getters
export const contactService = serviceRegistry.contactService;

// Re-export types for contacts
export type { Contact } from '../pages/Contacts';