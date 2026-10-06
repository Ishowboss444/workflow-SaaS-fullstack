const token = localStorage.getItem('accessToken');

export async function getInvites (){
    const response = await fetch('http://localhost:3000/invites/get' , {
        method : 'GET',
        headers : {
            Authorization: `Bearer ${token}`,
        }
    })

    const data = await response.json()
    return data
}

export async function sendInvites (id : number){
    if(!id) return console.log(id);
    
    const response = await fetch(`http://localhost:3000/invites/send/${id}` , {
        method : 'POST',
        headers : {
            Authorization: `Bearer ${token}`,
        }
    })
    
    const data = await response.json()
    return data
}