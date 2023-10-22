import { cn } from "@/shared/utils/utils";
import { VariantProps, cva } from "class-variance-authority";

const badgeVariants = cva(
    "font-medium mr-2 px-2.5 py-0.5 border whitespace-nowrap",
    {
        variants: {
            color: {
                red: "text-[#cf1322] bg-[#fff1f0] border-[#ffa39e]",
                volcano: "bg-[#fff2e8] text-[#d4380d] border-[#ffbb96]",
                magenta: "bg-[#fff0f6] text-[#c41d7f] border-[#ffadd2]",
                orange: "bg-[#fff7e6] text-[#d46b08] border-[#ffd591]",
                gold: "bg-[#fffbe6] text-[#d48806] border-[#ffe58f]",
                lime: "bg-[#fcffe6] text-[#7cb305] border-[#eaff8f]",
                green: "bg-[#f6ffed] text-[#389e0d] border-[#b7eb8f]",
                cyan: "bg-[#e6fffb] text-[#08979c] border-[#87e8de]",
                blue: "bg-[#e6f4ff] text-[#0958d9] border-[#91caff]",
                geekblue: "bg-[#f0f5ff] text-[#1d39c4] border-[#adc6ff]",
                purple: "bg-[#f9f0ff] text-[#531dab] border-[#d3adf7]",
                grey: "bg-secondary text-secondary-foreground hover:bg-secondary/80"

            },
            size: {
                default: "text-xs",
                lg: "text-sm",
            },
            type: {
                square: 'rounded',
                capsule: 'rounded-full'
            }
        },
        defaultVariants: {
            color: 'red',
            size: 'default',
            type: 'square'
        }
    }
)

interface badgeProps extends VariantProps<typeof badgeVariants> {
    className?: string;
    children: React.ReactNode;
    color?: "red" | "volcano" | "magenta" | "orange" | "gold" | "lime" | "green" | "cyan" | "blue" | "geekblue" | "purple" | "grey"
    size?: "default" | "lg";
}


export const Badge = ({ color, size, type, children, className }: badgeProps) => {

    return (
        <span className={cn(badgeVariants({ color, size, type }), className)}>{children}</span>
    )
}
