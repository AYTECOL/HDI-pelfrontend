class AccessTokenGeocoding {
    static async get() {
        const data = {
            client_id: 'bAt2Rw4jVIfVYQvF4RGy798ddXmaGKpq',
            client_secret: 'M7xAkX4NWaLdgqrN',
            grant_type: 'client_credentials'
        };
        const formBody = [];
        for (const property in data) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        const tokenResponse = await fetch('https://apis.us-east-1.libertymutual.com/oauth/access-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody.join("&")
        })
            .then(response => response)
            .then(obj => obj)
            .catch(error => console.log('error'))
        return tokenResponse.json();
    }
}

export default AccessTokenGeocoding;
