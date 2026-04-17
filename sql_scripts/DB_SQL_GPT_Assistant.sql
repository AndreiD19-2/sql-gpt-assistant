/* Dedicated DB for SQL GPT Assistant 
*/

create database SQL_GPT_Assistant
on primary(
			name='SQL_GPT_Assistant_Data',
			filename='/var/opt/mssql/data/SQL_GPT_Assistant_Data.mdf',
			size=100mb,
			filegrowth = 50mb
)
log on (
	name='SQL_GPT_Assistant_Log',
	filename='/var/opt/mssql/data/SQL_GPT_Assistant_Log.ldf',
	size=50mb,
	filegrowth=50mb
);
GO

alter database SQL_GPT_Assistant add filegroup FG_Index;

alter database SQL_GPT_Assistant
	add file( name='SQL_GPT_Index' , filename = '/var/opt/mssql/data/SQL_GPT_Assistant_Index.ndf')
	to filegroup FG_Index;
GO

create schema app_user
go

create schema logs
go

CREATE TABLE app_user.users (
  id INT IDENTITY PRIMARY KEY,
  email NVARCHAR(150) UNIQUE NOT NULL,
  password_hash NVARCHAR(255) NOT NULL,
  full_name NVARCHAR(150),
  role NVARCHAR(50) DEFAULT 'user',
  created_at DATETIME DEFAULT GETDATE()
);
CREATE TABLE app_user.user_settings (
  id INT IDENTITY PRIMARY KEY,
  user_id INT NOT NULL FOREIGN KEY REFERENCES app_user.users(id),
  setting_key NVARCHAR(100),
  encrypted_value NVARCHAR(MAX),
  iv VARBINARY(16),
  created_at DATETIME DEFAULT GETDATE()
);
CREATE TABLE app_user.query_history (
  id INT IDENTITY PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES app_user.users(id),
  user_input NVARCHAR(MAX),
  detected_mode NVARCHAR(50),
  generated_sql NVARCHAR(MAX),
  execution_result NVARCHAR(MAX),
  message NVARCHAR(MAX),
  is_favorite BIT DEFAULT 0,
  status NVARCHAR(20),
  created_at DATETIME DEFAULT GETDATE()
);
CREATE TABLE logs.auth_logs (
  id INT IDENTITY PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES app_user.users(id),
  action NVARCHAR(50), -- 'login', 'logout', 'register'
  success BIT,
  ip_address NVARCHAR(50),
  user_agent NVARCHAR(255),
  created_at DATETIME DEFAULT GETDATE()
);
