import { event } from "@prisma/client";
import { purifyString } from "./utils";
import dayjs from "dayjs";
import path from "path";
import fs from 'fs';


export function createImagesZipStream(event: event) {
    const zipName = `${purifyString(event.name)}_${dayjs(event.startDate).format('YYYYMMDDTHHmmss')}.zip`;
    const zipRelativePath = `uploads/images/archives/${zipName}`
    const zipStream = fs.createWriteStream(path.join(process.cwd(), 'public', zipRelativePath));
    return { zipName, zipRelativePath, zipStream }
}