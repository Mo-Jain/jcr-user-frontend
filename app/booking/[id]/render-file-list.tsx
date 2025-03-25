import { ImageIcon} from "lucide-react";
import { BsFilePdfFill } from "react-icons/bs";
import Link from "next/link";

export interface Document {
  id: number;
  name: string;
  url: string;
  type: string;
}

export const RenderFileList = ({
  documents,
}: {
  documents: Document[];
  type: "documents" | "photos" | "selfie";
  bookingId: string;
}) => {
 
  return (
    <>
      {documents.map((document, index) => {
        return (
          <RenderDocument
            key={index}
            id={document.id}
            name={document.name}
            url={document.url}
            type={document.type}
          />
        );
      })}
    </>
  );
};

const RenderDocument = ({
  name,
  url,
  type,
}: {
  id: number;
  name: string;
  url: string;
  type: string;
}) => {
  const getFileIcon = (type: string) => {
    if (!type.startsWith("image/")) {
      return <BsFilePdfFill className="w-4 h-4" />;
    }
    return <ImageIcon className="w-4 h-4" />;
  };
  return (
    <Link
      href={url}
      target="_blank"
      className="flex w-fit max-w-[130px] max-h-[30px] sm:max-w-[200px] sm:max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
    >
      <span className="min-w-4">{getFileIcon(type)}</span>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">
        {name}
      </span>
    </Link>
  );
};


