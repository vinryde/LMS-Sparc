import dataone from "./dataone.json"
import { DataTable } from "./_components/datatable"
import { AdminGetUsers } from "@/app/data/admin/admin-get-users"

export default async function UsersPage(){
    const users= await AdminGetUsers();
    return(
        <div>
            Hi Hello
            <DataTable data={users}/>
        </div>
    )
}