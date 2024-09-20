create database DotechProyectSystem

use DotechProyectSystem

create table ctTipoUsuario(
    idTipoUsuario int identity (1,1) primary key,
    descripcion nvarchar(100) not null,
    agregarUsuario varchar(1) not null,
    accionesPorton varchar(1) not null,
    accionesClima varchar(1) not null,
    comentarios nvarchar(500)
)

create table ctUsuario (
    idUsuario int identity (1,1) primary key ,
    idTipoUsuario int not null,
    userName nvarchar(50) not null,
    password nvarchar(MAX) not null ,
    nombreCompleto nvarchar(100) not null,
    fechaCreacion datetime not null ,
    fechaModificacion datetime,
    metadata nvarchar(1000),
    foreign key (idTipoUsuario) references ctTipoUsuario(idTipoUsuario),
)

create table ctTipoMovimiento(
    idTipoMovimiento int identity (1,1) primary key,
    descripcion nvarchar(100),
    nombreTabla nvarchar(100)
)
-- FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
create table tbHistorial(
    idHistorial int identity (1,1) primary key ,
    idUsuario int,
    fecha datetime not null,
    idTipoMovimiento int,
    valor nvarchar(100),
    foreign key(idUsuario) references ctUsuario(idUsuario),
    foreign key(idTipoMovimiento) references ctTipoMovimiento(idTipoMovimiento)
)

create table tbClima(
    idClima int identity (1,1) primary key,
    temperatura decimal(5,3),
    ultModificacion datetime,
    idUsuario int foreign key references ctUsuario(idUsuario),
    idTipoModificacion int not null,
    descripcion nvarchar(200),
    idEmpresa int not null,
    temperaturaMinDeseada decimal not null,
    temperaturaMaximaDeseada decimal not null
)

create table tbPorton(
    idPorton int identity (1,1) primary key,
    estatus varchar(1) not null,
    ultModificacion datetime,
    idUsuario int foreign key references ctUsuario(idUsuario),
    idTipoModificacion int not null,
    descripcion nvarchar(200),
    idEmpresa int not null,
    horarioMinAccion time,
    horarioMaxAccion time
)

create table tbContactos (
    id int  identity (1,1) primary key,
    telefono nvarchar(20) not null,
    accionesPorton char(1),
    accionesClima char(1),
    nombre nvarchar(100)
)