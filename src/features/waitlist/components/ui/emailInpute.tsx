// components/ui/EmailInput.tsx
interface Props {
    onSuccess: () => void;
    buttonText: string;         // 'Join Waitlist' OR 'Get Early Access'
    buttonStyle?: 'blue' | 'yellow'; // hero uses blue, CTA uses yellow
}

export default function EmailInput({ onSuccess, buttonText, buttonStyle = 'blue' }: Props) {
    // one component, used in two places with different props
}