import { X, Loader2, Info } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

// List of Indian states and union territories
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export interface AddressData {
  buildingInfo: string;
  streetInfo: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
}
interface FormErrors {
    [key: string]: string;
}

interface AddressFieldsProps {
  isValidPincode: boolean;
  setIsValidPincode: React.Dispatch<React.SetStateAction<boolean>>;
  contact?:string;
  name?:string;
  errors:FormErrors;
  setErrors:React.Dispatch<React.SetStateAction<FormErrors>>;
  formData:AddressData;
  setFormData:React.Dispatch<React.SetStateAction<AddressData>>;
  setContact?:React.Dispatch<React.SetStateAction<string>>;
  setName?:(value:string) => void;
  validatePincode:(pincode:string) => Promise<void>;
  isLoading:boolean;
}

export default function AddressFields({
  isValidPincode,
  setIsValidPincode,
  contact,
  name,
  errors,
  setErrors,
  formData,
  setFormData,
  setContact,
  setName,
  validatePincode,
  isLoading,
}: AddressFieldsProps) {
    
    
    const clearField = (field: keyof AddressData) => {
        setFormData(prev => ({ ...prev, [field]: '' }));
        if (field === 'pincode') {
          setIsValidPincode(false);
          setErrors((prev) => ({ ...prev, pincode: "" }))
        }
    };

    const handleFormDataChange = async (newData: AddressData) => {
        setFormData(newData);
        if (newData.pincode !== formData.pincode) {
          await validatePincode(newData.pincode);
        }
      };

    
  return (
    <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {name && setName &&
              <div>
                  <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
                      Name
                  </Label>
                  <Input
                  type="text"
                  value={name}
                  onChange={(e) => {
                      setName(e.target.value)
                      setErrors((prev) => ({ ...prev, name: "" }))
                  }}
                  className="w-full p-2 border rounded-sm border-black/25 dark:border-white/25"
                  required
                  />
              </div>
            }
            {contact && setContact &&
            <div>
                <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
                    Contact
                </Label>
                <Input
                    type="text"
                    value={contact || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            setContact(e.target.value)
                            setErrors((prev) => ({ ...prev, contact: "" }))
                        }
                    }}
                    maxLength={10}
                    className = "w-full p-2 border rounded-sm border-black/25 dark:border-white/25"
                />
                {errors.contact && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
                )}
            </div>
            }
        </div>
      <div>
        <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
          Flat, House no., Building, Company, Apartment
        </Label>
        <Input
          type="text"
          value={formData.buildingInfo}
          onChange={(e) => {
            setFormData({ ...formData, buildingInfo: e.target.value })
            setErrors((prev) => ({ ...prev, buildingInfo: "" }))
          }
        }
          className="w-full p-2 border rounded-sm border-black/25 dark:border-white/25"
          required
        />
        {errors.buildingInfo && (
            <p className="text-red-500 text-sm mt-1">{errors.buildingInfo}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
            <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
            Area, Street, Sector, Village
            </Label>
            <Input
            type="text"
            value={formData.streetInfo}
            onChange={(e) => {
                setFormData({ ...formData, streetInfo: e.target.value })
                setErrors((prev) => ({ ...prev, streetInfo: "" }))
            }}
            className="w-full p-2 border rounded-sm border-black/25 dark:border-white/25"
            required
            />
            {errors.streetInfo && (
                <p className="text-red-500 text-sm mt-1">{errors.streetInfo}</p>
            )}
        </div>

        <div>
            <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
            Landmark
            </Label>
            <Input
            type="text"
            value={formData.landmark}
            placeholder='e.g. near apollo hospital'
            onChange={(e) => {
                setFormData({ ...formData, landmark: e.target.value })
                setErrors((prev) => ({ ...prev, landmark: "" }))
            }}
            className="w-full p-2 border rounded-sm border-black/25 dark:border-white/25"
            />
            {errors.landmark && (
                <p className="text-red-500 text-sm mt-1">{errors.landmark}</p>
            )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
            Pin Code
          </Label>
          <div className="relative">
            <Input
              type="text"
              value={formData.pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                handleFormDataChange({ ...formData, pincode: value });
                setErrors((prev) => ({ ...prev, pincode: "" }))
              }}
              className={`w-full p-2 border rounded-sm border-black/25 dark:border-white/25 ${errors.pincode ? 'border-red-500' : ''}`}
              required
            />
            {isLoading ? (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 size={16} className="animate-spin text-gray-500" />
              </div>
            ) : isValidPincode && (
              <button
                type="button"
                onClick={() => clearField('pincode')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">
                    <Info className='w-3 h-3'/>
                    <span>{errors.pincode}</span> 
                </p>
            )}
        </div>

        <div>
          <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
            Town/City
          </Label>
          <div className="relative">
            <Input
              type="text"
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value })
                setErrors((prev) => ({ ...prev, city: "" }))
              }}
              className="w-full p-2 border rounded-sm border-black/25 dark:border-white/25"
              required
              readOnly={isValidPincode}
            />
            {formData.city && (
              <button
                type="button"
                onClick={() => clearField('city')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
        </div>
      </div>

      <div>
        <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-1">
          State
        </Label>
        <Select
          value={formData.state}
          onValueChange={(value) => {
            setFormData({ ...formData, state: value })
            setErrors((prev) => ({ ...prev, state: "" }))
          }}
          required
        >
            <SelectTrigger
                className="w-full text-sm border border-black/25 dark:border-white/25 focus-visible:border-blue-400 focus-visible:ring-blue-400"
                >
                <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="dark:border-zinc-700 bg-card">
            {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state} className='dark:hover:bg-zinc-700'>
                {state}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
        )}
      </div>
    </div>
  );
}