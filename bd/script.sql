USE [master]
GO
/****** Object:  Database [DotechProyectSystem]    Script Date: 21/01/2024 01:08:53 a. m. ******/
CREATE DATABASE [DotechProyectSystem]
GO
USE [DotechProyectSystem]
GO
/****** Object:  UserDefinedFunction [dbo].[splitstring]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[splitstring](@stringToSplit VARCHAR(MAX), @delimitador varchar(1))
    RETURNS
        @returnList TABLE
                    (
                        [Name] [nvarchar](500)
                    )
AS
BEGIN

    DECLARE @name NVARCHAR(255)
    DECLARE @pos INT

    WHILE CHARINDEX(@delimitador, @stringToSplit) > 0
        BEGIN
            SELECT @pos = CHARINDEX(@delimitador, @stringToSplit)
            SELECT @name = SUBSTRING(@stringToSplit, 1, @pos - 1)

            INSERT INTO @returnList
            SELECT @name

            SELECT @stringToSplit = SUBSTRING(@stringToSplit, @pos + 1, LEN(@stringToSplit) - @pos)
        END

    INSERT INTO @returnList
    SELECT @stringToSplit

    RETURN
END
GO
/****** Object:  Table [dbo].[ctTipoMovimiento]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ctTipoMovimiento](
	[idTipoMovimiento] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [nvarchar](100) NULL,
	[nombreTabla] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[idTipoMovimiento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ctTipoUsuario]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ctTipoUsuario](
	[idTipoUsuario] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [nvarchar](100) NOT NULL,
	[agregarUsuario] [varchar](1) NOT NULL,
	[accionesPorton] [varchar](1) NOT NULL,
	[accionesClima] [varchar](1) NOT NULL,
	[comentarios] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[idTipoUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ctUsuario]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ctUsuario](
	[idUsuario] [int] IDENTITY(1,1) NOT NULL,
	[idTipoUsuario] [int] NOT NULL,
	[userName] [nvarchar](50) NOT NULL,
	[password] [nvarchar](max) NOT NULL,
	[nombreCompleto] [nvarchar](100) NOT NULL,
	[fechaCreacion] [datetime] NOT NULL,
	[fechaModificacion] [datetime] NULL,
	[metadata] [nvarchar](1000) NULL,
PRIMARY KEY CLUSTERED 
(
	[idUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbClima]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbClima](
	[idClima] [int] IDENTITY(1,1) NOT NULL,
	[temperatura] [decimal](5, 3) NULL,
	[ultModificacion] [datetime] NULL,
	[idUsuario] [int] NULL,
	[idTipoModificacion] [int] NOT NULL,
	[descripcion] [nvarchar](200) NULL,
	[idEmpresa] [int] NOT NULL,
	[temperaturaMinDeseada] [decimal](18, 0) NOT NULL,
	[temperaturaMaximaDeseada] [decimal](18, 0) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idClima] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbContactos]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbContactos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[telefono] [nvarchar](20) NOT NULL,
	[accionesPorton] [char](1) NULL,
	[accionesClima] [char](1) NULL,
	[nombre] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbHistorial]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbHistorial](
	[idHistorial] [int] IDENTITY(1,1) NOT NULL,
	[idUsuario] [int] NULL,
	[fecha] [datetime] NOT NULL,
	[idTipoMovimiento] [int] NULL,
	[valor] [nvarchar](100) NULL,
	[uuid] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idHistorial] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbPorton]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbPorton](
	[idPorton] [int] IDENTITY(1,1) NOT NULL,
	[estatus] [char](1) NOT NULL,
	[ultModificacion] [datetime] NOT NULL,
	[idUsuario] [int] NOT NULL,
	[idTipoModificacion] [int] NOT NULL,
	[descripcion] [nvarchar](200) NULL,
	[idEmpresa] [int] NOT NULL,
	[horarioMinAccion] [time](7) NULL,
	[horarioMaxAccion] [time](7) NULL,
	[uuid] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idPorton] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ctUsuario]  WITH CHECK ADD FOREIGN KEY([idTipoUsuario])
REFERENCES [dbo].[ctTipoUsuario] ([idTipoUsuario])
GO
ALTER TABLE [dbo].[tbClima]  WITH CHECK ADD FOREIGN KEY([idUsuario])
REFERENCES [dbo].[ctUsuario] ([idUsuario])
GO
ALTER TABLE [dbo].[tbHistorial]  WITH CHECK ADD FOREIGN KEY([idTipoMovimiento])
REFERENCES [dbo].[ctTipoMovimiento] ([idTipoMovimiento])
GO
ALTER TABLE [dbo].[tbHistorial]  WITH CHECK ADD FOREIGN KEY([idUsuario])
REFERENCES [dbo].[ctUsuario] ([idUsuario])
GO
ALTER TABLE [dbo].[tbPorton]  WITH CHECK ADD  CONSTRAINT [tbPorton_ctUsuario__fk] FOREIGN KEY([idUsuario])
REFERENCES [dbo].[ctUsuario] ([idUsuario])
GO
ALTER TABLE [dbo].[tbPorton] CHECK CONSTRAINT [tbPorton_ctUsuario__fk]
GO
/****** Object:  StoredProcedure [dbo].[sp_get_history]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Luis Lucio
-- Create date: 01/12/2023
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_get_history]
    -- Add the parameters for the stored procedure here
    @idUsuario int,
    @uuid nvarchar(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @permiso as int
    select @permiso = accionesPorton
    from ctTipoUsuario
             inner join ctUsuario c on ctTipoUsuario.idTipoUsuario = c.idTipoUsuario
    where c.idUsuario = @idUsuario
    if @permiso <> 0 -- si es igual a cero, no tiene permiso de ver el historial
        begin
            select TOP 50 hist.idHistorial,
                          hist.fecha,
                          hist.idTipoMovimiento,
                          cU.nombreCompleto as userName
            from tbHistorial hist
                     inner join dbo.ctUsuario cU on cU.idUsuario = hist.idUsuario
            where uuid = @uuid
            order by hist.fecha DESC
        end
END
GO
/****** Object:  StoredProcedure [dbo].[sp_get_porton_uuid]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Luis Lucio
-- Create date: 01/12/2023
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_get_porton_uuid]
    -- Add the parameters for the stored procedure here
    @idUsuario int,
    @idTipoUsuario int,
    @uuidList nvarchar(MAX)
AS
BEGIN
    select estatus,
           ultmodificacion,
           idtipomodificacion,
           descripcion,
           horariominaccion,
           horariomaxaccion,
           uuid,
           (select nombreCompleto from ctUsuario where idUsuario = porton.idUsuario) nombre
    from tbPorton porton
    inner join dbo.ctUsuario cU on cU.idUsuario = @idUsuario
    where uuid in (select * from dbo.splitstring(@uuidList,'&'))
      and cU.idTipoUsuario = @idTipoUsuario
      and (select accionesPorton from ctTipoUsuario where idTipoUsuario = cU.idTipoUsuario) != 0
    -- si este tipo de usuario no tiene permiso para ver el porton, no va a obtener ningun dato
END
GO
/****** Object:  StoredProcedure [dbo].[sp_get_user_id]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author:		Luis Lucio
-- Create date: 30/11/2023
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_get_user_id]
    -- Add the parameters for the stored procedure here
    @idUsuario int
AS
BEGIN
    select usr.idUsuario,
           usr.idTipoUsuario,
           usr.metadata
    from ctUsuario usr
    where usr.idUsuario = @idUsuario

END
GO
/****** Object:  StoredProcedure [dbo].[sp_update_door]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author:		Luis Lucio
-- Create date: 16/01/2024
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_update_door]
    -- Add the parameters for the stored procedure here
    @idUsuario int,
    @estatus int,
    @uuid nvarchar(MAX)
AS
BEGIN
    DECLARE @permiso as int
    DECLARE @tipoUser as int
    select @permiso = cTU.accionesPorton,
           @tipoUser = cTU.idTipoUsuario
    from ctUsuario usuario
             inner join dbo.ctTipoUsuario cTU on cTU.idTipoUsuario = usuario.idTipoUsuario
    where usuario.idUsuario = @idUsuario

    if @permiso = 1 --  verifica que el usuario tenga permiso de modificar
        begin
            declare @tipoMovimiento as int
            if @estatus = 0
                begin
                    set @tipoMovimiento = 2
                end
            else
                begin
                    set @tipoMovimiento = 1
                end
            update tbPorton
            set idTipoModificacion = @estatus,
                idUsuario          = @idUsuario,
                ultModificacion    = GETDATE()
            where uuid = @uuid
            insert into tbHistorial (idUsuario, fecha, idTipoMovimiento, valor, uuid)
            values (@idUsuario, GETDATE(), @tipoMovimiento, NULL, @uuid)
            begin
                exec dbo.sp_get_porton_uuid @idUsuario, @tipoUser, @uuid
            end
        end
END
GO
/****** Object:  StoredProcedure [dbo].[sp_valid_user]    Script Date: 21/01/2024 01:08:53 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Luis Lucio
-- Create date: 30/11/2023
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_valid_user]
    -- Add the parameters for the stored procedure here
    @P_usuario nvarchar(255)
AS
BEGIN
    select usr.idUsuario ,
           usr.idTipoUsuario,
           usr.password,
           usr.nombreCompleto,
           usr.fechaModificacion,
           usr.metadata,
           cTU.agregarUsuario,
           cTU.accionesClima,
           cTU.accionesPorton,
           cTU.descripcion
    from ctUsuario usr
             inner join ctTipoUsuario cTU on usr.idTipoUsuario = cTU.idTipoUsuario
    where userName = @P_usuario

END
GO
