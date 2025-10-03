import { adminGetCource } from "@/app/data/admin/admin-get-course";

export default async function EditRoute(){
    const data = await adminGetCource("");
    return (
        <div>
            <h1>Edit Course: </h1>
        </div>
    )
}