import axios from 'axios';
import moment from 'moment';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useMemo } from 'react';
import { httpDelete, httpGet, httpPost } from '../helpers/http.helpers';

const API_URL = process.env.REACT_APP_API_URL || '';

export type UserDTO = {
    userId: number;
    isAdmin: boolean;
    email: string;
};

export function logIn(body: {
    email: string;
    password: string;
}) {
    return axios.post<string>(`${API_URL}/users/login`, body).then(res => {
        let token = jwtDecode<JwtPayload>(res.data);
        console.log("Token Exp: ", token.exp);
        if (token.exp !== undefined) {
            
            let expiration = moment.unix(token.exp);
            localStorage.setItem('radix.tokenExpiration', expiration.toISOString());
        }

        localStorage.setItem('radix.email', body.email);
        localStorage.setItem('radix.token', res.data);
        window.location.href = '/';
    })
    .catch(err => alert(err.response.data.Error)) 
}
export function logOut() {
    localStorage.removeItem('radix.email');
    localStorage.removeItem('radix.token');
    localStorage.removeItem('radix.tokenExpiration');
    window.location.href = '/';
}

export function useLoggedInUser() {
    return useMemo(() => {
        let expiration = localStorage.getItem('radix.tokenExpiration');

        if (expiration === null
        ||  moment(expiration).isBefore(new Date().toISOString())) {
            return null;
        }
        else {
            return localStorage.getItem('radix.email');
        }
    }, []);
}

export function registerUser(body: {
    email: string;
    isAdmin: boolean;
}) {
    return httpPost<number>('/users', body);
}

export function deleteUser(userId: number) {
    return httpDelete(`/users/${userId}`);
}

export function getUsers() {
    return httpGet<UserDTO[]>('/users');
}

export function getUser(userId: number) {
    return httpGet<UserDTO>(`/users/${userId}`);
}