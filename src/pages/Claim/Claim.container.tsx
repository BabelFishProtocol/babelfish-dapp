import { ClaimComponent } from './Claim.component';
import { ClaimFormValues } from './Claim.fields';

export const ClaimContainer = () => {
  const onSubmit = (data: ClaimFormValues) => {
    // TODO: implement
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return <ClaimComponent onSubmit={onSubmit} />;
};
