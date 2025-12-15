#generate_frontend.py
import		os 
               
		def 
create_file(path, content):
"" "Crea un archivo con el contenido especificado" "" 
os.makedirs(os.path.dirname(path), exist_ok = True) 
with open(path, 'w', encoding = 'utf-8')
	as		f:         
			f.		write     (content) 
print(f "âœ“ {path}") 

def generate_frontend():
"" "Genera todo el frontend React" "" 
print("Generando NeoCare-MVFrontend...") 

#1. package.json
create_file("NeoCare-MVFrontend/package.json", '' '{
"name":    "neocare-mvfrontend", 
"version": "1.0.0", 
"private": true, 
"dependencies":{
	
"react":"^18.2.0", 
"react-dom":"^18.2.0", 
"react-router-dom":"^6.8.0", 
"axios":"^1.3.0", 
"bootstrap":"^5.2.3" 
}, 
"scripts":{
	
"start":"react-scripts start", 
"build":"react-scripts build", 
"test":"react-scripts test", 
"eject":"react-scripts eject" 
}, 
"devDependencies":{
	
"react-scripts":"5.0.1" 
} 
} '' ')

#2. .env
create_file("NeoCare-MVFrontend/.env", "REACT_APP_API_URL=http://localhost:8000\n") 

#3. Public/index.html
create_file("NeoCare-MVFrontend/public/index.html", '' '<!DOCTYPE html>
	    < html lang = "es" > 
	    <head > 
	    <meta charset = "utf-8" / >
	    <title > NeoCare - Kanban App < /title > 
	    </head > 
	    <body > 
	    <noscript > Necesitas habilitar JavaScript para ejecutar esta aplicaci Ã ³n.< /noscript > 
	    <div id = "root" >< /div > 
	    </body > 
	    </html > '' ')
	    
#4. src/index.js
	    create_file("NeoCare-MVFrontend/src/index.js", '' 'import React from ' react ';
			import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';


	const		root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	    <React.StrictMode > 
	    <App / >
	    </React.StrictMode > 
);
'' ')

#5. src/App.jsx
create_file("NeoCare-MVFrontend/src/App.jsx", '' 'import React from ' react ';
	    import
	    {
	BrowserRouter as Router, Routes, Route, Navigate
}		from		'react-router-dom';

import {
	AuthProvider
} from './contexts/AuthContext';

import PrivateRoute from './components/Auth/PrivateRoute';

import LoginPage from './pages/LoginPage';

import RegisterPage from './pages/RegisterPage';

import BoardsPage from './pages/BoardsPage';

import KanbanPage from './pages/KanbanPage';

import DashboardPage from './pages/DashboardPage';

import Navbar from './components/Auth/Navbar';

import './App.css';


function App()
{
	
		return (
			<Router > 
			<AuthProvider > 
			<div className = "App" > 
			<Navbar / >
			<main className = "container" > 
			<Routes > 
			<Route path = "/login" element = {
		<LoginPage / >
	} />
		<Route path = "/register" element = {
		<RegisterPage / >
	} />
		<Route path = "/" element = {
		<PrivateRoute >< DashboardPage / ></PrivateRoute >
	} />
		<Route path = "/boards" element = {
		<PrivateRoute >< BoardsPage / ></PrivateRoute >
	} />
		<Route path = "/board/:boardId" element = {
		<PrivateRoute >< KanbanPage / ></PrivateRoute >
	} />
		<Route path = "*" element = {
		<Navigate to = "/" / >
	} />
		</Routes > 
		</main > 
		</div > 
		</AuthProvider > 
		</Router > 
		);
	
} 

export default App;
'' ')

#6. src/App.css
create_file("NeoCare-MVFrontend/src/App.css", '' '.App {
min - height:100 vh;

background - color:
#f5f5f5;
} 

.container
{
	
padding:	20 px;
	
max - width:	1400 px;
	
margin:	0 auto;
	
} 

.auth - form {
	
max - width:	400 px;
	
margin:	50 px auto;
	
padding:	30 px;
	
background:	white;
	
border - radius:8 px;
	
box - shadow:	0 2 px 10 px rgba(0, 0, 0, 0.1);
	
} 

.form - group {
	
margin - bottom:20 px;
	
} 

.btn - block {
	
width:		100 %;
	
} 

.kanban - board {
	
display:	flex;
	
gap:		20 px;
	
overflow - x:	auto;
	
padding:	20 px 0;
	
min - height:	500 px;
	
} 

.list - column {
	
background:
#ebecf0;
border - radius:8 px;
	
padding:	15 px;
	
min - width:	300 px;
	
max - width:	300 px;
	
} 

.task - card {
	
background:	white;
	
border - radius:4 px;
	
padding:	12 px;
	
margin - bottom:10 px;
	
box - shadow:	0 1 px 3 px rgba(0, 0, 0, 0.1);
	
cursor:	pointer;
	
} 

.task - card:hover {
	
box - shadow:	0 2 px 5 px rgba(0, 0, 0, 0.15);
	
} 

.board - card {
	
background:	white;
	
border - radius:8 px;
	
padding:	20 px;
	
height:	150 px;
	
display:	flex;
	
align - items:	center;
	
justify - content:center;
	
text - align:	center;
	
box - shadow:	0 2 px 5 px rgba(0, 0, 0, 0.1);
	
transition:	transform 0.2 s, box - shadow 0.2 s;
	
} 

.board - card:hover {
	
transform:	translateY(-5 px);
	
box - shadow:	0 5 px 15 px rgba(0, 0, 0, 0.2);
	
} 

.loader {
	
border:	4 px solid
#f3f3f3;
border - top:	4 px solid
#3498db;
border - radius:50 %;
	
width:		40 px;
	
height:	40 px;
	
animation:	spin 1 s linear infinite;
	
margin:	50 px auto;
	
} 

@keyframes spin {
	
		0 % {
transform:	rotate(0 deg);
	} 
		100 % {
transform:	rotate(360 deg);
	} 
} 

.navbar {
	
background:	linear - gradient(135 deg,
#667eea 0%, #764ba2 100%);
				  } 

.btn - primary {
	
background:	linear - gradient(135 deg,
#667eea 0%, #764ba2 100%);
border:			  none;
	
} 

.btn - primary:hover {
	
background:	linear - gradient(135 deg,
#5a6fd8 0%, #6a4190 100%);
				  } '' ')

#7. src/index.css
create_file("NeoCare-MVFrontend/src/index.css", '' '* {
margin:    0;

padding:0;

box - sizing:border - box;

} 

body
{
	
font - family:	-apple - system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans - serif;
	
background - color:
#f8f9fa;
} 

a {
	
text - decoration:none;
	
color:		inherit;
	
} 

a:hover {
	
text - decoration:underline;
	
} 

.text - center {
	
text - align:	center;
	
} 

.text - muted {
	
color:
#6c757d !important;
} 

.mt - 3 {
	
margin - top:	1 rem ! important;
	
} 

.mt - 5 {
	
margin - top:	3 rem ! important;
	
} 

.mb - 3 {
	
margin - bottom:1 rem ! important;
	
} 

.mb - 4 {
	
margin - bottom:1.5 rem ! important;
	
} 

.ml - auto {
	
margin - left:	auto ! important;
	
} 

.d - flex {
	
display:	flex ! important;
	
} 

.justify - content - between {
	
justify - content:space - between ! important;
	
} 

.justify - content - center {
	
justify - content:center ! important;
	
} 

.align - items - center {
	
align - items:	center ! important;
	
} 

.flex - column {
	
flex - direction:column ! important;
	
} 

.gap - 2 {
	
gap:		0.5 rem;
	
} 

.w - 100 {
	
width:		100 % !important;
	
} 

.row {
	
display:	flex;
	
flex - wrap:	wrap;
	
margin - right:-15 px;
	
margin - left:	-15 px;
	
} 

.col - md - 4 {
	
flex:		0 0 33.333333 %;
	
max - width:	33.333333 %;
	
padding:	15 px;
	
} 

.col - md - 6 {
	
flex:		0 0 50 %;
	
max - width:	50 %;
	
padding:	15 px;
	
} 

.col - md - 8 {
	
flex:		0 0 66.666667 %;
	
max - width:	66.666667 %;
	
padding:	15 px;
	
} 

@media(max - width:768 px)
{
	
		.col - md - 4,.col - md - 6,.col - md - 8 {
		
flex:			0 0 100 %;
		
max - width:		100 %;
		
	} 
		
		.kanban - board {
		
flex - direction:	column;
		
	} 
		
		.list - column {
		
min - width:		100 %;
		
	} 
} 

.form - control {
	
display:	block;
	
width:		100 %;
	
padding:	0.375 rem 0.75 rem;
	
font - size:	1 rem;
	
font - weight:	400;
	
line - height:	1.5;
	
color:
#495057;
background - color:
#fff;
background - clip:padding - box;
	
border:	1 px solid
#ced4da;
border - radius:0.25 rem;
	
transition:	border - color 0.15 s ease - in - out, box - shadow 0.15 s ease - in - out;
	
} 

.form - control:focus {
	
color:
#495057;
background - color:
#fff;
border - color:
#80bdff;
outline:0;
	
box - shadow:	0 0 0 0.2 rem rgba(0, 123, 255, 0.25);
	
} 

.form - group {
	
margin - bottom:1 rem;
	
} 

.form - group label {
	
display:	block;
	
margin - bottom:0.5 rem;
	
font - weight:	500;
	
} 

.btn {
	
display:	inline - block;
	
font - weight:	400;
	
text - align:	center;
	
vertical - align:middle;
	
user - select:	none;
	
border:	1 px solid transparent;
	
padding:	0.375 rem 0.75 rem;
	
font - size:	1 rem;
	
line - height:	1.5;
	
border - radius:0.25 rem;
	
transition:	color 0.15 s ease - in - out, background - color 0.15 s ease - in - out, border - color 0.15 s ease - in - out, box - shadow 0.15 s ease - in - out;
	
cursor:	pointer;
	
} 

.btn:disabled {
	
opacity:	0.65;
	
cursor:	not - allowed;
	
} 

.btn - sm {
	
padding:	0.25 rem 0.5 rem;
	
font - size:	0.875 rem;
	
line - height:	1.5;
	
border - radius:0.2 rem;
	
} 

.btn - lg {
	
padding:	0.5 rem 1 rem;
	
font - size:	1.25 rem;
	
line - height:	1.5;
	
border - radius:0.3 rem;
	
} 

.btn - primary {
	
color:
#fff;
} 

.btn - secondary {
	
color:
#fff;
background - color:
#6c757d;
border - color:
#6c757d;
} 

.btn - secondary:hover {
	
background - color:
#5a6268;
border - color:
#545b62;
} 

.btn - success {
	
color:
#fff;
background - color:
#28a745;
border - color:
#28a745;
} 

.btn - success:hover {
	
background - color:
#218838;
border - color:
#1e7e34;
} 

.btn - light {
	
color:
#212529;
background - color:
#f8f9fa;
border - color:
#f8f9fa;
} 

.btn - light:hover {
	
background - color:
#e2e6ea;
border - color:
#dae0e5;
} 

.btn - link {
	
font - weight:	400;
	
color:
#007bff;
background - color:transparent;
	
border:	none;
	
} 

.btn - link:hover {
	
color:
#0056b3;
text - decoration:underline;
	
} 

.alert {
	
position:	relative;
	
padding:	0.75 rem 1.25 rem;
	
margin - bottom:1 rem;
	
border:	1 px solid transparent;
	
border - radius:0.25 rem;
	
} 

.alert - danger {
	
color:
#721c24;
background - color:
#f8d7da;
border - color:
#f5c6cb;
} 

.navbar {
	
padding:	0.75 rem 1 rem;
	
} 

.navbar - brand {
	
font - size:	1.5 rem;
	
font - weight:	bold;
	
} 

.navbar - nav {
	
display:	flex;
	
list - style:	none;
	
margin:	0;
	
padding:	0;
	
} 

.nav - item {
	
margin - left:	1 rem;
	
} 

.nav - link {
	
color:		white ! important;
	
padding:	0.5 rem;
	
} 

.nav - link:hover {
	
text - decoration:none;
	
opacity:	0.8;
	
} 

.card {
	
position:	relative;
	
display:	flex;
	
flex - direction:column;
	
min - width:	0;
	
word - wrap:	break -word;
	
background - color:
#fff;
background - clip:border - box;
	
border:	1 px solid rgba(0, 0, 0, .125);
	
border - radius:0.25 rem;
	
} 

.card - body {
	
flex:		1 1 auto;
	
padding:	1.25 rem;
	
} 

.card - title {
	
margin - bottom:0.75 rem;
	
} 

.modal {
	
position:	fixed;
	
top:		0;
	
left:		0;
	
width:		100 %;
	
height:	100 %;
	
z - index:	1050;
	
} 

.modal - dialog {
	
position:	relative;
	
width:		auto;
	
margin:	1.75 rem auto;
	
max - width:	500 px;
	
} 

.modal - content {
	
position:	relative;
	
display:	flex;
	
flex - direction:column;
	
width:		100 %;
	
pointer - events:auto;
	
background - color:
#fff;
background - clip:padding - box;
	
border:	1 px solid rgba(0, 0, 0, .2);
	
border - radius:0.3 rem;
	
} 

.modal - header {
	
display:	flex;
	
align - items:	flex - start;
	
justify - content:space - between;
	
padding:	1 rem;
	
border - bottom:1 px solid
#dee2e6;
border - top - left - radius:calc(0.3 rem - 1 px);
	
border - top - right - radius:calc(0.3 rem - 1 px);
	
} 

.modal - title {
	
margin - bottom:0;
	
line - height:	1.5;
	
} 

.modal - body {
	
position:	relative;
	
flex:		1 1 auto;
	
padding:	1 rem;
	
} 

.modal - footer {
	
display:	flex;
	
align - items:	center;
	
justify - content:flex - end;
	
padding:	1 rem;
	
border - top:	1 px solid
#dee2e6;
} 

.btn - close {
	
background:	none;
	
border:	none;
	
font - size:	1.5 rem;
	
cursor:	pointer;
	
color:
#000;
opacity:0.5;
	
} 

.btn - close:hover {
	
opacity:	0.75;
	
} 

.badge {
	
display:	inline - block;
	
padding:	0.25em 0.4em;
	
font - size:	75 %;
	
font - weight:	700;
	
line - height:	1;
	
text - align:	center;
	
white - space:	nowrap;
	
vertical - align:baseline;
	
border - radius:0.25 rem;
	
} 

.bg - secondary {
	
background - color:
#6c757d !important;
} 

.textarea {
	
min - height:	100 px;
	
} 

.spinner - border {
	
display:	inline - block;
	
width:		2 rem;
	
height:	2 rem;
	
vertical - align:text - bottom;
	
border:	0.25em solid currentColor;
	
border - right - color:transparent;
	
border - radius:50 %;
	
animation:	spinner - border .75 s linear infinite;
	
} 

.visually - hidden {
	
position:	absolute ! important;
	
width:		1 px ! important;
	
height:	1 px ! important;
	
padding:	0 ! important;
	
margin:	-1 px ! important;
	
overflow:	hidden ! important;
	
clip:		rect(0, 0, 0, 0) ! important;
	
white - space:	nowrap ! important;
	
border:	0 ! important;
	
} 

@keyframes spinner - border {
	
		to {
transform:	rotate(360 deg);
	} 
} '' ')

#8. API Configuration
create_file("NeoCare-MVFrontend/src/api/axiosConfig.js", '' 'import axios from ' axios ';
	    
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';


	const		axiosInstance = axios.create({
baseURL:API_URL, 
headers:{
'Content-Type':'application/json', 
	}, 
	});
	
		
		axiosInstance.interceptors.request.use(
						       (config) = >{
		
			const		token = localStorage.getItem('token');
		
			if (token) {
			
				config.headers.Authorization = `Bearer $ {
				token
			} `;
			
		} 
			return config;
		
	}, 
		(error) = >Promise.reject(error) 
		);
	
		
		axiosInstance.interceptors.response.use(
						   (response) = >response, 
							(error) = >{
		
			if (error.response ?.status == = 401) {
			
				localStorage.removeItem('token');
			
				window.location.href = '/login';
			
		} 
			return Promise.reject(error);
		
	} 
		);
	
		
		export default axiosInstance;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/api/endpoints.js", '' 'import axiosInstance from './ axiosConfig ';
			    
			    export const authAPI = {
		
			register:       (data)= >axiosInstance.post('/auth/register', data),
		               
				login:        (data) = >axiosInstance.post('/auth/login', data),
		               
				getMe:        () = >axiosInstance.get('/auth/me'), 
	};
	
		
		export const	boardsAPI = {
		getBoards:() = >axiosInstance.get('/boards/'), 
		createBoard:(data) = >axiosInstance.post('/boards/', data), 
	};
	'' ')
		
#9. Auth Context
		create_file("NeoCare-MVFrontend/src/contexts/AuthContext.jsx", '' 'import React, { createContext, useState, useContext, useEffect } from ' react ';
			    import {
		authAPI
	} from '../api/endpoints';
	
		
		const		AuthContext = createContext(null);
	
		
	export const	AuthProvider = ({children}) = >{
		const[user, setUser] = useState(null);
		
			const           [loading, setLoading] = useState(true);
		
			const           [token, setToken] = useState(localStorage.getItem('token'));
		
			
			useEffect(() = >{
			
				if (token) {
				
					fetchUser();
				
			} else {
				
					setLoading(false);
				
			} 
		},[token]);
		
			
			const		fetchUser = async() = >{
			try {
				const response = await authAPI.getMe();
				               
						setUser       (response.data);
				               
			} catch(error) {
				
				logout();
				
			}		finally {
				
				setLoading(false);
				
			} 
		};
		
			
			const		login = async(email, password) = >{
			try {
				const response = await authAPI.login({email, password});
				               
				const {
					access_token
				} = response.data;
				               
						localStorage.	setItem('token', access_token);
				               
						setToken      (access_token);
				               
						await		fetchUser();
				               
						return {
			success:	true
				};
				
			}		catch        (error) {
				
				return {
			success: false, error:'Credenciales invÃ¡lidas'
				};
				
			} 
		};
		
			
			const register = async(username, email, password) = >{
			try {
				const response = await authAPI.register ({username, email, password});
				               
				const		loginResponse = await login(email, password);
				               
						return	loginResponse;
				               
			} catch(error) {
				
				return {
					
			success:	false, 
			error:		error.response ?.data ?.detail || 'Error en el registro' 
				};
				
			} 
		};
		
			
			const		logout = () = >{
			localStorage.removeItem('token');
			
			setToken(null);
			
			setUser(null);
			
		};
		
			
			return (
				<AuthContext.Provider value = {{
				user, login, register, logout, loading
		}
		}              >
		{
			children
		}              
		               </AuthContext.Provider > 
		);
		
	};
	
		
		export const	useAuth = () = >{
		const context = useContext(AuthContext);
		
			if (!context) {
			
				throw new Error('useAuth debe usarse dentro de AuthProvider');
			
		} 
			return context;
		
	};
	'' ')
		
#10. Components
		create_file("NeoCare-MVFrontend/src/components/Auth/PrivateRoute.jsx", '' 'import React from ' react ';
			    import {
		Navigate
	} from 'react-router-dom';
	
		import {
		useAuth
	} from '../../contexts/AuthContext';
	
		
	const		PrivateRoute = ({children}) = >{
		const {user, loading} = useAuth();
		
			
			if (loading) {
			
				return (
				     <div className = "text-center mt-5" > 
					<div className = "loader" >< /div > 
					<p > Cargando...< /p > 
					</div > 
				);
			
		} 
			
			return user ? children : <Navigate to = "/login" / >;
		
	};
	
		
		export default PrivateRoute;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/components/Auth/LoginForm.jsx", '' 'import React, { useState } from ' react ';
			    import {
		useNavigate, Link
	} from 'react-router-dom';
	
		import {
		useAuth
	} from '../../contexts/AuthContext';
	
		
		const		LoginForm = () = >{
		const[email, setEmail] = useState('');
		
			const           [password, setPassword] = useState('');
		
			const           [error, setError] = useState('');
		
			const           [loading, setLoading] = useState(false);
		
			
			const {
			login
		} = useAuth();
		
			const		navigate = useNavigate();
		
			
			const		handleSubmit = async(e) = >{
			e.preventDefault();
			
			setError('');
			
			setLoading(true);
			
			
			const		result = await login(email, password);
			               
			               
			if              (result.success) {
				
				navigate('/boards');
				
			} else {
				
				setError(result.error);
				
			} 
				setLoading(false);
			
		};
		
			
			return (
				<div className = "auth-form" > 
				<h2 > Iniciar Sesi Ã ³n < /h2 > 
				{
			error && <div className = "alert alert-danger" > {
				error
			} </div >
		} 
			<form onSubmit = {
			handleSubmit
		} >
			<div className = "form-group" > 
			<label > Email < /label > 
			<input 
			type = "email" 
			className = "form-control" 
			value = {
			email
		} 
			onChange = {
			(e) = >setEmail(e.target.value)
		} 
			required 
			/>
			</div > 
			<div className = "form-group" > 
			<label > Contrase Ã ±a < /label > 
			<input 
			type = "password" 
			className = "form-control" 
			value = {
			password
		} 
			onChange = {
			(e) = >setPassword(e.target.value)
		} 
			required 
			/>
			</div > 
			<button 
			type = "submit" 
			className = "btn btn-primary btn-block" 
			disabled = {
			loading
		} 
			>
		{
			loading ? 'Cargando...' : 'Iniciar SesiÃ³n'
		} 
			</button > 
			</form > 
			<p className = "mt-3" > 
			Â¿No tienes cuenta ? <Link to = "/register" > Reg Ã ­strate aqu Ã ­</Link > 
			</p > 
			</div > 
			);
		
	};
	
		
		export default LoginForm;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/components/Auth/RegisterForm.jsx", '' 'import React, { useState } from ' react ';
			    import {
		useNavigate, Link
	} from 'react-router-dom';
	
		import {
		useAuth
	} from '../../contexts/AuthContext';
	
		
		const		RegisterForm = () = >{
		const[formData, setFormData] = useState({
			username:'', 
			email:'', 
			password:'', 
			confirmPassword:'' 
		});
		
			const           [error, setError] = useState('');
		
			const           [loading, setLoading] = useState(false);
		
			
			const {
			register
		} = useAuth();
		
			const		navigate = useNavigate();
		
			
			const		handleChange = (e) = >{
			setFormData({
				...formData, 
				[e.target.name]:e.target.value 
			});
			
		};
		
			
			const		handleSubmit = async(e) = >{
			e.preventDefault();
			
			setError('');
			
			
			if (formData.password !== formData.confirmPassword) {
				
				return setError('Las contraseÃ±as no coinciden');
				
			}              
			               
					setLoading    (true);
			
				const		result = await register (formData.username, formData.email, formData.password);
			
				
				if (result.success) {
				
					navigate('/boards');
				
			} else {
				
					setError(result.error);
				
			} 
				setLoading(false);
			
		};
		
			
			return (
				<div className = "auth-form" > 
				<h2 > Registrarse < /h2 > 
				{
			error && <div className = "alert alert-danger" > {
				error
			} </div >
		} 
			<form onSubmit = {
			handleSubmit
		} >
			<div className = "form-group" > 
			<label > Nombre de Usuario < /label > 
			<input 
			type = "text" 
			name = "username" 
			className = "form-control" 
			value = {
			formData.username
		} 
			onChange = {
			handleChange
		} 
			required 
			/>
			</div > 
			<div className = "form-group" > 
			<label > Email < /label > 
			<input 
			type = "email" 
			name = "email" 
			className = "form-control" 
			value = {
			formData.email
		} 
			onChange = {
			handleChange
		} 
			required 
			/>
			</div > 
			<div className = "form-group" > 
			<label > Contrase Ã ±a < /label > 
			<input 
			type = "password" 
			name = "password" 
			className = "form-control" 
			value = {
			formData.password
		} 
			onChange = {
			handleChange
		} 
			required 
			minLength = "6" 
			/>
			</div > 
			<div className = "form-group" > 
			<label > Confirmar Contrase Ã ±a < /label > 
			<input 
			type = "password" 
			name = "confirmPassword" 
			className = "form-control" 
			value = {
			formData.confirmPassword
		} 
			onChange = {
			handleChange
		} 
			required 
			/>
			</div > 
			<button 
			type = "submit" 
			className = "btn btn-primary btn-block" 
			disabled = {
			loading
		} 
			>
		{
			loading ? 'Registrando...' : 'Registrarse'
		} 
			</button > 
			</form > 
			<p className = "mt-3" > 
			Â¿Ya tienes cuenta ? <Link to = "/login" > Inicia sesi Ã ³n aqu Ã ­</Link > 
			</p > 
			</div > 
			);
		
	};
	
		
		export default RegisterForm;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/components/Auth/Navbar.jsx", '' 'import React from ' react ';
			    import {
		Link, useNavigate
	} from 'react-router-dom';
	
		import {
		useAuth
	} from '../../contexts/AuthContext';
	
		
		const		Navbar = () = >{
		const {user, logout} = useAuth();
		
			const		navigate = useNavigate();
		
			
			const		handleLogout = () = >{
			logout();
			
			navigate('/login');
			
		};
		
			
			return (
				<nav className = "navbar" > 
				<div className = "container" > 
				<Link className = "navbar-brand" to = "/" > NeoCare Kanban < /Link > 
				
				{
			user ? (
				<div className = "navbar-nav" > 
			     <span className = "nav-item nav-link" > Hola, {
				user.email
			} </span > 
				<Link className = "nav-item nav-link" to = "/boards" > Mis Tableros < /Link > 
				<button 
				className = "nav-item btn btn-link nav-link" 
				onClick = {
				handleLogout
			} 
				>
				Cerrar Sesi Ã ³n 
				</button > 
				</div > 
				) : (
				     <div className = "navbar-nav" > 
				     <Link className = "nav-item nav-link" to = "/login" > Iniciar Sesi Ã ³n < /Link > 
				     <Link className = "nav-item nav-link" to = "/register" > Registrarse < /Link > 
				     </div > 
				)
		} 
			</div > 
			</nav > 
			);
		
	};
	
		
		export default Navbar;
	'' ')
		
#11. Kanban Components
		create_file("NeoCare-MVFrontend/src/components/Kanban/BoardCard.jsx", '' 'import React from ' react ';
			    
			    const BoardCard = ({
		board
	}) = >{
		
			return (
				<div className = "board-card" > 
				<div > 
				<h3 > {
			board.title
		} </h3 > 
<p className = "text-muted" > ID:{
			board.id
		} </p > 
			</div > 
			</div > 
			);
		
	};
	
		
		export default BoardCard;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/components/Kanban/KanbanBoard.jsx", '' 'import React, { useState } from ' react ';
			    import ListColumn from './ListColumn';
	
		
	const		KanbanBoard = ({board}) = >{
		const[lists, setLists] = useState(board.lists ||[]);
		
			
			const		addList = () = >{
			const newList = {
				id:Date.now(), 
				title:'Nueva Lista', 
				cards:[] 
			};
			               
					setLists      ([...lists, newList]);
			               
		};
		
			
			const		addCard = (listId, content) = >{
			setLists(lists.map(list = >{
				if (list.id == = listId) {
					
					return {
						...list, 
						cards:[...list.cards, {
							id:Date.now(), 
							content 
						}] 
					};
					
				} 
				return list;
				
			}));
			
		};
		
			
			return (
				<div className = "kanban-board-container" > 
				<div className = "d-flex justify-content-between align-items-center mb-4" > 
<h2 > Tablero:			{
			board.title
		} </h2 > 
			<button className = "btn btn-success" onClick = {
			addList
		} >
			+A Ã ±adir Lista 
			</button > 
			</div > 
			
			<div className = "kanban-board" > 
		{
			lists.map((list, index) = >(
						    <ListColumn 
						    key = {
				list.id
			} 
				list = {
				list
			} 
				index = {
				index
			} 
				onAddCard = {
				addCard
			} 
				/>
				))
		} 
			</div > 
			</div > 
			);
		
	};
	
		
		export default KanbanBoard;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/components/Kanban/ListColumn.jsx", '' 'import React, { useState } from ' react ';
			    import TaskCard from './TaskCard';
	
		
	const		ListColumn = ({list, onAddCard}) = >{
		const[showAddCard, setShowAddCard] = useState(false);
		
			const           [newCardContent, setNewCardContent] = useState('');
		
			
			const		handleAddCard = () = >{
			if (newCardContent.trim()) {
				
				onAddCard(list.id, newCardContent);
				
				setNewCardContent('');
				
				setShowAddCard(false);
				
			} 
		};
		
			
			return (
				<div className = "list-column" > 
				<div className = "d-flex justify-content-between align-items-center mb-3" > 
				<h5 className = "mb-0" > {
			list.title
		} </h5 > 
			<span className = "badge bg-secondary" > {
			list.cards ?.length || 0
		} </span > 
			</div > 
			
			<div className = "cards-list" > 
		{
			list.cards ?.map((card, index) = >(
							   <TaskCard key = {
				card.id
			} card = {
				card
			} index = {
				index
			} />
				))
		} 
			</div > 
			
		{
			showAddCard ? (
				   <div className = "add-card-form mt-3" > 
				       <textarea 
				       className = "form-control mb-2" 
			placeholder = "Escribe el tÃ­tulo de la tarjeta..." 
				       value = {
				newCardContent
			} 
				onChange = {
				(e) = >setNewCardContent(e.target.value)
			} 
				autoFocus 
				rows = "3" 
				/>
				<div className = "d-flex gap-2" > 
				<button 
				className = "btn btn-primary btn-sm" 
				onClick = {
				handleAddCard
			} 
				>
				A Ã ±adir 
				</button > 
				<button 
				className = "btn btn-secondary btn-sm" 
				onClick = {
				() = >setShowAddCard(false)
			} 
				>
				Cancelar 
				</button > 
				</div > 
				</div > 
				) : (
				     <button 
			     className = "btn btn-light btn-sm w-100 mt-3" 
				     onClick = {
				() = >setShowAddCard(true)
			} 
				>
				+A Ã ±adir tarjeta 
				</button > 
				)
		} 
			</div > 
			);
		
	};
	
		
		export default ListColumn;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/components/Kanban/TaskCard.jsx", '' 'import React from ' react ';
			    
			    const TaskCard = ({
		card
	}) = >{
		
			return (
				<div className = "task-card" > 
				<p className = "mb-1" > {
			card.content
		} </p > 
			<small className = "text-muted" > 
		{
			card.createdAt || 'Hace un momento'
		} 
			</small > 
			</div > 
			);
		
	};
	
		
		export default TaskCard;
	'' ')
		
#12. Common Components
		create_file("NeoCare-MVFrontend/src/components/Common/Modal.jsx", '' 'import React from ' react ';
			    
			    const Modal = ({
		show, onClose, title, children
	}) = >{
		
			if (!show)
			return null;
		
			
			return (
				<div className = "modal show" style = {{
		display: 'block', backgroundColor:'rgba(0,0,0,0.5)'
		}
		} >
			<div className = "modal-dialog" > 
			<div className = "modal-content" > 
			<div className = "modal-header" > 
			<h5 className = "modal-title" > {
			title
		} </h5 > 
			<button 
			type = "button" 
			className = "btn-close" 
			onClick = {
			onClose
		} 
			></button > 
			</div > 
			<div className = "modal-body" > 
		{
			children
		} 
			</div > 
			</div > 
			</div > 
			</div > 
			);
		
	};
	
		
		export default Modal;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/components/Common/Loader.jsx", '' 'import React from ' react ';
			    
			    const Loader = () = >{
		
			return (
				<div className = "d-flex justify-content-center align-items-center" style = {{
		height:	'200px'
		}
		} >
			<div className = "spinner-border text-primary" role = "status" > 
			<span className = "visually-hidden" > Cargando...< /span > 
			</div > 
			</div > 
			);
		
	};
	
		
		export default Loader;
	'' ')
		
#13. Pages
		create_file("NeoCare-MVFrontend/src/pages/LoginPage.jsx", '' 'import React from ' react ';
		       import LoginForm from '../components/Auth/LoginForm';
	
		
		const		LoginPage = () = >{
		return (
			<div className = "login-page" > 
			<div className = "row justify-content-center" > 
			<div className = "col-md-6" > 
			<LoginForm / >
			</div > 
			</div > 
			</div > 
		);
		
	};
	
		
		export default LoginPage;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/pages/RegisterPage.jsx", '' 'import React from ' react ';
		 import RegisterForm from '../components/Auth/RegisterForm';
	
		
		const		RegisterPage = () = >{
		return (
			<div className = "register-page" > 
			<div className = "row justify-content-center" > 
			<div className = "col-md-6" > 
			<RegisterForm / >
			</div > 
			</div > 
			</div > 
		);
		
	};
	
		
		export default RegisterPage;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/pages/BoardsPage.jsx", '' 'import React, { useState, useEffect } from ' react ';
			    import {
		Link
	} from 'react-router-dom';
	
		import {
		boardsAPI
	} from '../api/endpoints';
	
		import BoardCard from '../components/Kanban/BoardCard';
	
		import Modal from '../components/Common/Modal';
	
		
		const		BoardsPage = () = >{
		const[boards, setBoards] = useState([]);
		
			const           [loading, setLoading] = useState(true);
		
			const           [showModal, setShowModal] = useState(false);
		
			const           [newBoardTitle, setNewBoardTitle] = useState('');
		
			
			useEffect(() = >{
			
				fetchBoards();
			
		},[]);
		
			
			const		fetchBoards = async() = >{
			try {
				const response = await boardsAPI.getBoards();
				               
						setBoards     (response.data);
				               
			} catch(error) {
				
				console.error('Error al cargar tableros:', error);
				
			}		finally {
				
				setLoading(false);
				
			} 
		};
		
			
			const		createBoard = async() = >{
			try {
				const response = await boardsAPI.createBoard({title:newBoardTitle});
				               
						setBoards     ([...boards, response.data]);
				               
						setNewBoardTitle('');
				               
						setShowModal  (false);
				               
			} catch(error) {
				
				console.error('Error al crear tablero:', error);
				
			}              
		};
		
			
			if (loading) {
			
				return <div className = "text-center mt-5" > Cargando tableros...< /div >;
			
		} 
			
			return (
				<div className = "boards-page" > 
				<div className = "d-flex justify-content-between align-items-center mb-4" > 
				<h1 > Mis Tableros < /h1 > 
				<button 
				className = "btn btn-primary" 
				onClick = {
			() = >setShowModal(true)
		} 
			>
			+Nuevo Tablero 
			</button > 
			</div > 
			
		{
			boards.length == = 0 ? (
				     <div className = "text-center mt-5" > 
				   <h3 > No tienes tableros a Ã ºn < /h3 > 
						<button 
					     className = "btn btn-primary" 
						onClick = {
				() = >setShowModal(true)
			} 
				>
				Crear Tablero 
				</button > 
				</div > 
				) : (
				     <div className = "row" > 
				     {
				boards.map(board = >(
				    <div className = "col-md-4 mb-4" key = {
					board.id
				} >
					<Link to = {
					`/board / $ {
						board.id
					} `
				} style = {{
				textDecoration:'none'
				}
				} >
					<BoardCard board = {
					board
				} />
					</Link > 
					</div > 
					))
			} 
				</div > 
				)
		} 
			
			<Modal 
			show = {
			showModal
		} 
			onClose = {
			() = >setShowModal(false)
		} 
			title = "Nuevo Tablero" 
			>
			<div className = "form-group" > 
			<label > T Ã ­tulo del Tablero < /label > 
			<input 
			type = "text" 
			className = "form-control" 
			value = {
			newBoardTitle
		} 
			onChange = {
			(e) = >setNewBoardTitle(e.target.value)
		} 
			placeholder = "Ej: Proyecto Web" 
			/>
			</div > 
			<div className = "modal-footer" > 
			<button 
			className = "btn btn-secondary" 
			onClick = {
			() = >setShowModal(false)
		} 
			>
			Cancelar 
			</button > 
			<button 
			className = "btn btn-primary" 
			onClick = {
			createBoard
		} 
			disabled = {
			!newBoardTitle.trim()
		} 
			>
			Crear 
			</button > 
			</div > 
			</Modal > 
			</div > 
			);
		
	};
	
		
		export default BoardsPage;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/pages/KanbanPage.jsx", '' 'import React, { useState, useEffect } from ' react ';
			    import {
		useParams
	} from 'react-router-dom';
	
		import KanbanBoard from '../components/Kanban/KanbanBoard';
	
		
		const		KanbanPage = () = >{
		const {boardId} = useParams();
		
			const           [board, setBoard] = useState(null);
		
			const           [loading, setLoading] = useState(true);
		
			
			useEffect(() = >{
			
				setTimeout(() = >{
				
					setBoard({
					
			id:			boardId, 
			title:			`Tablero $ {
						boardId
					} `, 
			lists:			[
						 {
				id: 1, title: 'Por Hacer', cards:[]
					}, 
					{
				id: 2, title: 'En Progreso', cards:[]
					}, 
					{
				id: 3, title: 'Completado', cards:[]
					} 
						] 
				});
				
					setLoading(false);
				
			}, 500);
			
		},[boardId]);
		
			
			if (loading) {
			
				return <div className = "text-center mt-5" > Cargando tablero...< /div >;
			
		} 
			
			return (
				<div className = "kanban-page" > 
				<h1 > {
			board.title
		} </h1 > 
			<KanbanBoard board = {
			board
		} />
			</div > 
			);
		
	};
	
		
		export default KanbanPage;
	'' ')
		
		create_file("NeoCare-MVFrontend/src/pages/DashboardPage.jsx", '' 'import React from ' react ';
			    import {
		Link
	} from 'react-router-dom';
	
		
		const		DashboardPage = () = >{
		return (
			<div className = "dashboard-page text-center" > 
			<h1 className = "mb-4" > Â¡Bienvenido a NeoCare Kanban !< /h1 > 
			
			<div className = "row justify-content-center" > 
			<div className = "col-md-8" > 
			<div className = "card mb-4" > 
			<div className = "card-body" > 
			<h3 > Comienza ahora < /h3 > 
		<Link to = "/boards" className = "btn btn-primary btn-lg" > 
			Ver mis Tableros 
			</Link > 
			</div > 
			</div > 
			</div > 
			</div > 
			</div > 
		);
		
	};
	
		
		export default DashboardPage;
	'' ')
		
#14. Utils
		create_file("NeoCare-MVFrontend/src/utils/auth.js", '' 'export const tokenService = {
getToken:		    () = >localStorage.getItem('token'), 
setToken:		  (token) = >localStorage.setItem('token', token), 
removeToken:		    () = >localStorage.removeItem('token'), 
			    
isTokenValid:		    () = >{
		
			const		token = localStorage.getItem('token');
		
			if (!token)
			return false;
		
			
			try {
			
				const		payload = JSON.parse(atob(token.split('.')[1]));
			
				return payload.exp * 1000 > Date.now();
			
		} catch {
			
				return false;
			
		} 
	} 
	};
	'' ')
		
create_file("NeoCare-MVFrontend/src/utils/constants.js", '' 'export const API_URL = process.env.REACT_APP_API_URL || ' http: //localhost:8000 ';
			    export const TOKEN_KEY = 'neocare_token';
	
		export const	USER_KEY = 'neocare_user';
	'' ')
		
		print("\nâœ… NeoCare-MVFrontend generado exitosamente!") 
		print("\nðŸ“‹ Pasos para ejecutar:") 
		print("1. cd NeoCare-MVFrontend") 
		print("2. npm install") 
		print("3. npm start") 
		print("\nâš¡ AsegÃºrate que NeoCare-MVBackend estÃ© corriendo en http://localhost:8000") 
		
		if __name__
== "__main__":	
