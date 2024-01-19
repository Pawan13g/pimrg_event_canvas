
// HOOKS
import { useState } from "react";

// UI COMPONENTS
import { Dialog, DialogContent } from "./dialog";
import { Download } from "lucide-react";
import Link from "next/link";

const useImageDialog = () => {
    const [image, setImage] = useState<string | undefined>(undefined);

    const ImageDialog = () => {
        return (
            <Dialog open={!!image}>
                <DialogContent
                    className="!border-none md:max-w-fit object-contain overflow-hidden"
                    closeFn={() => setImage(undefined)}
                >
                    {
                        !!image &&
                        <Link className="absolute right-14 top-4" target="_blank" href={image} download={true} >
                            <Download className="p-1 rounded-md bg-white text-black shadow-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2"
                            />
                        </Link>
                    }

                    <img
                        className="object-contain max-h-max md:max-h-[600px]"
                        src={image}
                        alt="image"
                    />
                </DialogContent>
            </Dialog>
        );
    };

    return {
        image,
        setImage,
        ImageDialog,
    };
};

export { useImageDialog };
