import Axios from "axios";

export default async function(config) {
    try {
        const response = await Axios.post(`http://${config.pufferpanel.host}/auth/login`, {
            "email": config.pufferpanel.email,
            "password": config.pufferpanel.password
        });

        if (response.data && response.data.session) {
            console.log(`[Puffergrator] Sucessfully authenticated.`);
            return response.data.session
        }
    } catch (error) {
        console.log(`[Puffergrator] Failed to authenticate with provided credentials.`, error);
        return false
    }
}