-- Migracion desde el esquema antiguo confirmado en produccion.
-- Ejecutar una sola vez, con respaldo y backend detenido.
-- Precondiciones: las cuatro tablas nuevas no existen; cursos, ejercicios
-- y progreso_ejercicios estan vacias. MariaDB DDL hace commits implicitos.
SET NAMES utf8mb4;

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
