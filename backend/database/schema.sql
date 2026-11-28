-- Esquema para CI y bases de pruebas desechables. NO ejecutar en produccion.
SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET NAMES utf8mb4;
SET @OLD_TIME_ZONE=@@TIME_ZONE;
SET TIME_ZONE='+00:00';
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS progreso_codigo;
DROP TABLE IF EXISTS ejercicio_lenguajes;
DROP TABLE IF EXISTS usuarios_cursos;
DROP TABLE IF EXISTS progreso_ejercicios;
DROP TABLE IF EXISTS solicitudes_maestros;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS ejercicios;
DROP TABLE IF EXISTS lenguajes;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('estudiante','maestro','admin') NOT NULL DEFAULT 'estudiante',
    creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY username (username),
    UNIQUE KEY correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE password_reset_tokens (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expira_en DATETIME NOT NULL,
    usado_en DATETIME DEFAULT NULL,
    creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_password_reset_token_hash (token_hash),
    KEY idx_password_reset_usuario (usuario_id),
    CONSTRAINT fk_password_reset_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cursos (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY titulo (titulo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ejercicios (
    id INT NOT NULL AUTO_INCREMENT,
    curso_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    instrucciones TEXT NOT NULL,
    codigo_inicial TEXT DEFAULT NULL,
    orden INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY fk_ejercicio_curso (curso_id),
    CONSTRAINT fk_ejercicio_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE solicitudes_maestros (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente','aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
    mensaje TEXT DEFAULT NULL,
    revisado_por INT DEFAULT NULL,
    revisado_en TIMESTAMP NULL DEFAULT NULL,
    creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY fk_solicitud_usuario (usuario_id),
    KEY fk_solicitud_revisor (revisado_por),
    CONSTRAINT fk_solicitud_revisor FOREIGN KEY (revisado_por) REFERENCES usuarios(id),
    CONSTRAINT fk_solicitud_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE progreso_ejercicios (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    ejercicio_id INT NOT NULL,
    completado TINYINT(1) NOT NULL DEFAULT 0,
    completado_en TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY fk_progreso_usuario (usuario_id),
    KEY fk_progreso_ejercicio (ejercicio_id),
    CONSTRAINT fk_progreso_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_progreso_ejercicio FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios_cursos (
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    asignado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, curso_id),
    KEY idx_usuarios_cursos_curso (curso_id),
    CONSTRAINT fk_usuarios_cursos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_usuarios_cursos_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lenguajes (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_lenguaje_nombre (nombre),
    UNIQUE KEY uq_lenguaje_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE progreso_ejercicios
    ADD COLUMN actualizado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN estado ENUM('en_progreso','entregado','aprobado','requiere_correcciones') NOT NULL DEFAULT 'en_progreso',
    ADD COLUMN entregado_en TIMESTAMP NULL DEFAULT NULL,
    ADD COLUMN revisado_en TIMESTAMP NULL DEFAULT NULL,
    ADD COLUMN revisado_por INT DEFAULT NULL,
    ADD COLUMN retroalimentacion TEXT DEFAULT NULL,
    ADD UNIQUE KEY uq_usuario_ejercicio (usuario_id, ejercicio_id),
    ADD CONSTRAINT fk_progreso_revisor FOREIGN KEY (revisado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

CREATE TABLE ejercicio_lenguajes (
    ejercicio_id INT NOT NULL,
    lenguaje_id INT NOT NULL,
    codigo_inicial LONGTEXT DEFAULT NULL,
    orden INT NOT NULL DEFAULT 0,
    PRIMARY KEY (ejercicio_id, lenguaje_id),
    KEY fk_ejercicio_lenguaje_lenguaje (lenguaje_id),
    CONSTRAINT fk_ejercicio_lenguaje_ejercicio FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id) ON DELETE CASCADE,
    CONSTRAINT fk_ejercicio_lenguaje_lenguaje FOREIGN KEY (lenguaje_id) REFERENCES lenguajes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE progreso_codigo (
    id INT NOT NULL AUTO_INCREMENT,
    progreso_id INT NOT NULL,
    lenguaje_id INT NOT NULL,
    codigo LONGTEXT DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_progreso_lenguaje (progreso_id, lenguaje_id),
    KEY fk_codigo_lenguaje (lenguaje_id),
    CONSTRAINT fk_codigo_lenguaje FOREIGN KEY (lenguaje_id) REFERENCES lenguajes(id) ON DELETE CASCADE,
    CONSTRAINT fk_codigo_progreso FOREIGN KEY (progreso_id) REFERENCES progreso_ejercicios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET TIME_ZONE=@OLD_TIME_ZONE;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
