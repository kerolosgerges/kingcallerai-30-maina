# Dynamic Pricing Page Implementation

This implementation provides a fully dynamic pricing page that integrates with the Stripe Billing API.

## Components

### DynamicPricingPage
The main pricing page component that displays pricing plans in a responsive grid layout matching the design from the provided image.

**Features:**
- Dynamic loading of pricing plans
- Real-time subscription management
- Loading states and error handling
- Responsive design (1 column on mobile, 3 columns on desktop)
- Visual indicators for current plan and popular plans

### Usage

```tsx
import { BillingProvider } from '@/components/billing/BillingProvider';
import DynamicPricingPage from '@/components/billing/DynamicPricingPage';

function App() {
  return (
    <BillingProvider>
      <DynamicPricingPage />
    </BillingProvider>
  );
}
```

## API Integration

The component integrates with the Stripe Billing API through the following services:

### StripeService
Located at `/services/stripeService.ts`, provides methods for:
- Creating and managing customers
- Creating and managing subscriptions
- Processing payments
- Fetching pricing plans dynamically

### Custom Hook: usePricingPlans
Located at `/hooks/usePricingPlans.ts`, manages:
- Fetching pricing plans from the API
- Caching plan data
- Transforming API responses to match the UI structure
- Providing default plans as fallback

## Plan Structure

Each pricing plan includes:
- **id**: Unique identifier for the plan
- **priceId**: Stripe price ID for subscription creation
- **name**: Display name of the plan
- **monthlyPrice**: Monthly subscription cost
- **setupFee**: One-time setup fee (if applicable)
- **activationFee**: One-time activation fee (if applicable)
- **perMinuteRate**: Cost per minute for usage
- **icon**: Visual icon component
- **popular**: Boolean flag for highlighting
- **features**: Array of feature descriptions
- **concurrentCalls**: Concurrent call limit description

## Customization

### Styling
The component uses Tailwind CSS classes and can be customized by:
- Modifying the color scheme in the component
- Adjusting spacing and sizing through Tailwind classes
- Updating the Card component styles

### Adding New Plans
To add new plans, update the `defaultPlans` array in `/hooks/usePricingPlans.ts` or configure them in your Stripe dashboard with appropriate metadata.

### API Endpoints
The component expects the following API endpoints:
- `GET /products` - Fetch Stripe products
- `GET /prices` - Fetch Stripe prices
- `POST /subscriptions` - Create new subscription
- `GET /subscriptions/{saas_id}` - Get current subscription

## Error Handling

The component includes comprehensive error handling:
- Failed API calls show toast notifications
- Falls back to default plans if API is unavailable
- Displays loading states during operations
- Prevents duplicate subscription attempts

## Testing

To test the implementation:
1. Ensure the Stripe Billing API is running
2. Configure valid Stripe price IDs in the plans
3. Test plan selection and subscription creation
4. Verify error handling with invalid API responses