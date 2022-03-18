import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFieldArray, useForm } from 'react-hook-form';
import { ControlledAddressInput } from '../../components/AddressInput/AddressInput.controlled';
import { AppDialog } from '../../components/AppDialog/AppDialog.component';
import { Button } from '../../components/Button/Button.component';
import { ControlledCurrencyInput } from '../../components/CurrencyInput/CurrencyInput.controlled';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';
import { ControlledInput } from '../../components/TextInput/TextInput.controlled';
import { fieldsErrors } from '../../constants';
import { isValidCalldata, isValidSignature } from '../../utils/helpers';
import {
  AddProposalDefaultValues,
  AddProposalInputs,
  AddProposalNewSetValues,
} from './AddProposal.fields';
import { AddProposalFields, AddProposalProps } from './AddProposal.types';

const AP_DD_OPTIONS = [
  { id: '1', name: 'Governer Admin' },
  { id: '2', name: 'Governer Owner' },
];

export const AddProposal = ({
  isOpenDialog,
  onClose,
  onSubmit,
}: AddProposalProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm<AddProposalFields>({
    mode: 'onChange',
    defaultValues: AddProposalDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: AddProposalInputs.Values,
  });

  return (
    <AppDialog
      isOpenDialog={isOpenDialog}
      onClose={onClose}
      title="Create Proposal"
      dialogProps={{
        scroll: 'body',
      }}
      dialogPaperProps={{
        sx: {
          width: '800px',
        },
      }}
    >
      <Box sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            <Typography
              sx={{ alignSelf: 'center', textAlign: 'left' }}
              variant="h4"
            >
              Send Proposal Contract
            </Typography>
            <ControlledDropdown
              name={AddProposalInputs.SendProposalContract}
              control={control}
              options={AP_DD_OPTIONS}
              setValue={setValue}
            />
          </Box>

          <ControlledInput
            name={AddProposalInputs.Description}
            control={control}
            placeholder="Description"
            multiline
            rows={4}
          />

          {fields.map((_, index) => (
            <Box
              key={index}
              sx={({ palette }) => ({
                p: 1,
                mt: 1,
                borderRadius: 1,
                border: `1px solid ${palette.primary.main}`,
              })}
            >
              {index > 0 && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    remove(index);
                  }}
                  sx={{ float: 'right' }}
                >
                  Delete
                </Button>
              )}
              <Box
                sx={() => ({
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                })}
              >
                <ControlledAddressInput
                  placeholder="Target"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Target}`}
                  control={control}
                />
                <ControlledCurrencyInput
                  symbol="RBTC"
                  placeholder="Value"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Value}`}
                  control={control}
                />
                <ControlledInput
                  placeholder="Signature"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Signature}`}
                  control={control}
                  rules={{
                    validate: (val) =>
                      isValidSignature(val)
                        ? true
                        : fieldsErrors.invalidSignature,
                  }}
                />
                <ControlledInput
                  placeholder="Callata"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Calldata}`}
                  control={control}
                  rules={{
                    validate: (val) =>
                      isValidCalldata(val)
                        ? true
                        : fieldsErrors.invalidCalldata,
                  }}
                />
              </Box>
            </Box>
          ))}
          <Box>
            <Button
              variant="outlined"
              sx={{ width: '100%', my: 2 }}
              onClick={() => {
                append(AddProposalNewSetValues);
              }}
            >
              +
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            <Button type="submit" disabled={!isValid}>
              Confirm
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </AppDialog>
  );
};
