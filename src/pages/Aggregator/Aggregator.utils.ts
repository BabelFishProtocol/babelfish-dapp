import { FocusActiveFieldParameters } from './Aggregator.types';

export const focusCurrentFieldIfEmpty = ({
  isPreviousFieldEmpty,
  isCurrentFieldEmpty,
  currentFieldRef,
}: FocusActiveFieldParameters) => {
  if (
    !isPreviousFieldEmpty &&
    currentFieldRef?.current &&
    isCurrentFieldEmpty
  ) {
    const node = currentFieldRef.current;
    node.style.borderWidth = '1px';
    node.style.borderStyle = 'solid';
    node.style.borderColor = '#ffbf42';
    node.style.color = '#ffbf42';
  }
};

export const removeFocusFromCurrentField = ({
  isPreviousFieldEmpty,
  isCurrentFieldEmpty,
  currentFieldRef,
}: FocusActiveFieldParameters) => {
  if (
    !isPreviousFieldEmpty &&
    currentFieldRef.current &&
    !isCurrentFieldEmpty
  ) {
    const node = currentFieldRef.current;
    node.style.borderColor = 'transparent';
    node.style.color = '#fff';
  }
};
