import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFieldArray, useForm } from 'react-hook-form';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { Button } from '../Button/Button.component';
import { ControlledDropdown } from '../Dropdown/Dropdown.controlled';
import { ControlledInput } from '../TextInput/TextInput.controlled';
import { AddProposalFields, AddProposalProps } from './AddProposal.types';
import { AddProposalInputs } from './AddProposalFields';

const AP_DD_OPTIONS = [
  { id: '1', name: 'Governer Admin' },
  { id: '2', name: 'Governer Owner' },
];

export const AddProposal = ({
  isOpenDialog,
  onClose,
  onSubmit,
}: AddProposalProps) => {
  const { control, handleSubmit, formState } = useForm<AddProposalFields>({
    defaultValues: {
      [AddProposalInputs.SendProposalContract]: '1',
      [AddProposalInputs.Description]: '',
      [AddProposalInputs.Values]: [
        {
          [AddProposalInputs.Target]: '',
          [AddProposalInputs.Value]: '',
          [AddProposalInputs.Calidata]: '',
          [AddProposalInputs.Signature]: '',
        },
      ],
    },
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
            />
          </Box>

          <ControlledInput
            name={AddProposalInputs.Description}
            control={control}
            placeholder="Description"
            multiline
            rows={4}
            error={formState.errors[AddProposalInputs.Description]}
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
              <Box
                sx={() => ({
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                })}
              >
                <ControlledInput
                  placeholder="Target"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Target}`}
                  control={control}
                  error={
                    formState.errors[AddProposalInputs.Values]?.[index]?.[
                      AddProposalInputs.Target
                    ]
                  }
                />
                <ControlledInput
                  placeholder="Value"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Value}`}
                  control={control}
                  error={
                    formState.errors[AddProposalInputs.Values]?.[index]?.[
                      AddProposalInputs.Value
                    ]
                  }
                />
                <ControlledInput
                  placeholder="Signature"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Signature}`}
                  control={control}
                  error={
                    formState.errors[AddProposalInputs.Values]?.[index]?.[
                      AddProposalInputs.Signature
                    ]
                  }
                />
                <ControlledInput
                  placeholder="Calidata"
                  name={`${AddProposalInputs.Values}.${index}.${AddProposalInputs.Calidata}`}
                  control={control}
                  error={
                    formState.errors[AddProposalInputs.Values]?.[index]?.[
                      AddProposalInputs.Calidata
                    ]
                  }
                />
              </Box>
            </Box>
          ))}
          <Box>
            <Button
              variant="outlined"
              sx={{ width: '100%', my: 2 }}
              onClick={() => {
                append({});
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
            <Button type="submit">Confirm</Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </AppDialog>
  );
};
