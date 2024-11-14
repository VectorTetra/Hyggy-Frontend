import axios from 'axios';

export interface CustomerQueryParams {
SearchParameter?: string;
Id?: string;
Name?: string;
Surname?: string;
Email?: string;
Phone?: string;
OrderId?: string;
PageNumber?: number;
PageSize?: number;
String?: string;
Sorting?: string;
QueryAny?: string;
}

// GET запит (вже реалізований)
export async function getCustomers(params: CustomerQueryParams = {}) {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/Customer', {
            params,
        });
        // const response = await axios.get('http://localhost:5263/api/Customer', {
        // 	params,
        // });
        return response.data;
    } catch (error) {
        console.error('Error fetching Shops:', error);
        throw new Error('Failed to fetch Shops');
    }
}


// DELETE запит для видалення складу за Id
export async function deleteCustomer(id: string) {
    try {
        const response = await axios.delete(`http://www.hyggy.somee.com/api/Customer/${id}`);

        //const response = await axios.delete(`http://localhost:5263/api/Customer/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Shop:', error);
        throw new Error('Failed to delete Shop');
    }
}
