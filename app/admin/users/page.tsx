import dataone from "./dataone.json"
import { DataTable } from "./_components/datatable"
import { AdminGetUsers } from "@/app/data/admin/admin-get-users"

export default async function UsersPage(){
    const users= await AdminGetUsers();
    return(
        <div className="space-y-2">
            <h1 className="text-4xl mb-5 mx-4 font-semibold text-primary">User data</h1>
            <DataTable data={users}/>
        </div>
    )
}