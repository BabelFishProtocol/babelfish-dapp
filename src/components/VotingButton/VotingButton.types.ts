import { ButtonProps } from "@mui/material/Button";
import { VoteType } from "../../constants";

export type VotingButtonProps = {
    type: VoteType,
    sx?: Partial<ButtonProps['sx']>,
    onClick?: () => void
}