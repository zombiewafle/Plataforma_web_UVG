/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-13.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: plataforma_uvg
-- ------------------------------------------------------
-- Server version	13.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Dumping data for table `cursos`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
INSERT INTO `cursos` (`id`, `titulo`, `descripcion`, `orden`, `creado_en`) VALUES (1,'HTML desde cero','Aprende la estructura básica de una página web utilizando HTML.',1,'2026-11-23 00:22:05'),
(2,'CSS desde cero','Aprende a diseñar y dar estilo a tus páginas web con CSS.',2,'2026-11-23 00:22:05'),
(3,'JavaScript básico','Aprende los fundamentos de JavaScript y agrega interactividad a tus páginas.',3,'2026-11-23 00:22:05');
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `lenguajes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
INSERT INTO `lenguajes` (`id`, `nombre`, `slug`) VALUES (1,'HTML','html'),
(2,'CSS','css'),
(3,'JavaScript','javascript');
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `ejercicios`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
INSERT INTO `ejercicios` (`id`, `curso_id`, `titulo`, `instrucciones`, `codigo_inicial`, `orden`) VALUES (1,1,'Estructura básica de HTML','Crea una página HTML utilizando las etiquetas html, head y body.','<!DOCTYPE html><html><head><title>Mi primera página</title></head><body></body></html>',1),
(2,1,'Encabezados y párrafos','Agrega un encabezado principal y un párrafo dentro del body.','<h1>Mi título</h1><p>Mi primer párrafo</p>',2),
(3,1,'Enlaces e imágenes','Agrega un enlace y una imagen utilizando las etiquetas a e img.','<a href=\"https://example.com\">Visitar sitio</a><img src=\"imagen.jpg\" alt=\"Descripción\">',3),
(9,3,'Creación dinámica de elementos HTML','Utiliza document.getElementById, createElement, textContent y appendChild para crear dinámicamente un formulario con una etiqueta, un campo de texto y un botón. Todos estos elementos deben generarse desde JavaScript.',NULL,1),
(10,3,'Captura de datos de un formulario','Utiliza addEventListener para detectar cuándo se presiona el botón. Obtén los valores del nombre y correo electrónico. Verifica que ninguno esté vacío y muestra los datos ingresados mediante textContent. Utiliza datos ficticios durante las pruebas.',NULL,2),
(11,1,'Historia interactiva','Crea una historia de fantasía con una introducción, dos decisiones y dos finales diferentes. Utiliza encabezados, párrafos y enlaces internos.',NULL,4),
(12,1,'Formulario en línea','Crea un formulario de contacto con campos para nombre, correo, teléfono y mensaje. Utiliza form, label, input y textarea. Agrega un botón de envío.',NULL,5),
(13,2,'Logo de los Juegos Olímpicos','Recrea los cinco aros olímpicos utilizando CSS. Utiliza border, border-radius, width, height y position. Organiza los aros en dos filas y superponlos sin utilizar imágenes.',NULL,1),
(14,2,'Menú de navegación','Estiliza un menú de navegación horizontal. Agrega un color de fondo, elimina las viñetas, separa los enlaces y utiliza :hover para cambiar su color al pasar el cursor.',NULL,2);
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `ejercicio_lenguajes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
INSERT INTO `ejercicio_lenguajes` (`ejercicio_id`, `lenguaje_id`, `codigo_inicial`, `orden`) VALUES (1,1,'<!DOCTYPE html><html><head><title>Mi primera página</title></head><body></body></html>',1),
(1,2,'',2),
(1,3,'',3),
(2,1,'<h1>Mi título</h1><p>Mi primer párrafo</p>',1),
(3,1,'<a href=\"https://example.com\">Visitar sitio</a><img src=\"imagen.jpg\" alt=\"Descripción\">',1),
(9,1,'<h1>Elementos dinámicos</h1>\n\n<div id=\"container\"></div>',1),
(9,3,'const container = document.getElementById(\"container\");\n\n// Crea el formulario.\n\n// Crea una etiqueta.\n\n// Crea un campo de texto.\n\n// Crea un botón.\n\n// Agrega los elementos al contenedor.',2),
(10,1,'<h1>Formulario interactivo</h1>\n\n<form>\n    <label for=\"nombre\">Nombre:</label>\n    <input type=\"text\" id=\"nombre\">\n\n    <br><br>\n\n    <label for=\"correo\">Correo:</label>\n    <input type=\"email\" id=\"correo\">\n\n    <br><br>\n\n    <button type=\"button\" id=\"enviar\">Enviar</button>\n</form>\n\n<p id=\"resultado\"></p>',1),
(10,3,'const boton = document.getElementById(\"enviar\");\n\n// Agrega el evento click.\n\n// Obtén los valores de los campos.\n\n// Verifica que los campos no estén vacíos.\n\n// Muestra el resultado.',2),
(11,1,'<h1>Mi historia interactiva</h1>\n    <p>Escribe el comienzo de tu aventura.</p>\n    <!-- Agrega las decisiones y los finales -->',1),
(12,1,'<h1>Formulario de contacto</h1>\n\n<form>\n    <!-- Agrega los campos del formulario -->\n</form>',1),
(13,1,'<h1>Logo de los Juegos Olímpicos</h1>\n\n<div class=\"logo\">\n    <div class=\"primera-fila\">\n        <div class=\"aro\" id=\"azul\"></div>\n        <div class=\"aro\" id=\"negro\"></div>\n        <div class=\"aro\" id=\"rojo\"></div>\n    </div>\n    <div class=\"segunda-fila\">\n        <div class=\"aro\" id=\"amarillo\"></div>\n        <div class=\"aro\" id=\"verde\"></div>\n    </div>\n</div>',1),
(13,2,'/* Estiliza los aros olímpicos */\n\n.aro {\n\n}\n\n.primera-fila {\n\n}\n\n.segunda-fila {\n\n}\n\n/* Asigna los colores correspondientes */',2),
(14,1,'<nav>\n    <ul>\n        <li><a href=\"#\">Inicio</a></li>\n        <li><a href=\"#\">Productos</a></li>\n        <li><a href=\"#\">Nosotros</a></li>\n        <li><a href=\"#\">Contacto</a></li>\n    </ul>\n</nav>\n\n<h1>Bienvenido a mi sitio web</h1>',1),
(14,2,'/* Estiliza el menú */\n\nnav {\n\n}\n\nnav ul {\n\n}\n\nnav li {\n\n}\n\nnav a {\n\n}\n\nnav a:hover {\n\n}',2);
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-11-27 20:14:24
