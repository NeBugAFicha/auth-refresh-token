import React, { useContext, useEffect, useState } from 'react';
import { Context } from './index';
import LoginForm from './components/LoginForm';
import {observer} from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

function App() {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);  
  useEffect(()=>{
    if(localStorage.getItem('token')){
      store.checkAuth();
    }
  },[]);

  async function getUsers(){
    try{
      const response = await UserService.fetchUsers();
      setUsers(response.data)
    } catch(e){
      console.log(e);
    }
  }
  if(store.isLoading){
    return <div>Loading...</div>
  }
  if(!store.isAuth){
    return (
      <LoginForm/>
    )
  }
  return (
    <div>
      <h1>{store.isAuth?`User is authorized ${store.user.email}`:`Authorize!`}</h1>
      <h1>{store.user.isActivated ? 'Account is submitted with with email': 'Submit your account!'}</h1>
      <button onClick={()=>store.logout()}>Log Out</button>
      <div>
        <button onClick={()=>getUsers()}>Get all Users</button>
      </div>
      {users.map((user:IUser) => <div key={user.email}>{user.email}</div>)}
    </div>
  );
}

export default observer(App);
