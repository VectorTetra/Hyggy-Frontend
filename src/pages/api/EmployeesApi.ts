import axios from 'axios';


export interface ShopEmployeeDto{
    Id?: number;
    Name?: string;
    Surname?: string;
    Email?: string;
    Phone?:string;
    Password?: string;
    ConfirmPassword?: string;
    ShopId: number
}
export interface StorageEmployeeDto{
    Id?: number;
    Name?: string;
    Surname?: string;
    Email?: string;
    Phone?:string;
    Password?: string;
    ConfirmPassword?: string;
    StorageId: number
}
// GET запит (вже реалізований)
export async function getShopEmployees() {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/shopemployee/shopemployes');
        // const response = await axios.get('http://localhost:5263/api/Customer', {
        // 	params,
        // });
        return response.data;
    } catch (error) {
        console.error('Error fetching Shops:', error);
        throw new Error('Failed to fetch Shops');
    }
}
export async function postShopEmployee(Shop: ShopEmployeeDto) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/shopemployee/register', Shop);
		//const response = await axios.post('http://localhost:5263/api/Shop', Shop);
		return response.data;
	} catch (error) {
		console.error('Error creating Shop:', error);
		throw new Error('Failed to create Shop');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteShopEmployee(id: string) {
    try {
        const response = await axios.delete(`http://www.hyggy.somee.com/api/shopemployee/deleteemployee?id=${id}`);

        //const response = await axios.delete(`http://localhost:5263/api/Customer/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Shop:', error);
        throw new Error('Failed to delete Shop');
    }
}


    //Запиити для співробітників складів
    export async function getStorageEmployees() {
        try {
            const response = await axios.get('http://www.hyggy.somee.com/api/storageemployee/storageemployees');
            // const response = await axios.get('http://localhost:5263/api/Customer', {
            // 	params,
            // });
            return response.data;
        } catch (error) {
            console.error('Error fetching Storages:', error);
            throw new Error('Failed to fetch Storages');
        }
    }
    export async function postStorageEmployee(Storage: StorageEmployeeDto) {
        try {
            const response = await axios.post('http://www.hyggy.somee.com/api/storageemployee/register', Storage);
            //const response = await axios.post('http://localhost:5263/api/Storage', Storage);
            return response.data;
        } catch (error) {
            console.error('Error creating Storage:', error);
            throw new Error('Failed to create Storage');
        }
    }
    
    // DELETE запит для видалення складу за Id
    export async function deleteStorageEmployee(id: string) {
        try {
            const response = await axios.delete(`http://www.hyggy.somee.com/api/storageemployee/deleteemployee?id=${id}`);
    
            //const response = await axios.delete(`http://localhost:5263/api/Customer/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting Storage:', error);
            throw new Error('Failed to delete Storage');
        }
    }

