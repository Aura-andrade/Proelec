const Usuario = require('../models/User'); // Importamos el modelo
const bcrypt = require('bcryptjs');
const enviarCorreo = require('../utils/emailSender');


// Función para registrar un nuevo usuario

const generarContraseña = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contraseña = '';
  for (let i = 0; i < 10; i++) {
    contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contraseña;
};

const crearUsuario = async (req, res) => {

  console.log(req.body); // TEMPORAL: para verificar los datos
  try {
    const {
      identificacion,
      nombreCompleto,
      cargo,
      correo,
      rol,
      estado,
      proyectosAsignados
    } = req.body;

    // Verificar campos obligatorios
    if (
      !identificacion || !nombreCompleto || !cargo ||
      !correo || !rol || typeof estado === 'undefined' ||
      !proyectosAsignados || proyectosAsignados.length === 0
    ) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el ID ya existe
    const existeID = await Usuario.findOne({ identificacion });
    if (existeID) {
      return res.status(400).json({ mensaje: 'ID ya fue registrado.' });
    }

    // Verificar si el correo ya existe
    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo) {
      return res.status(400).json({ mensaje: 'correo ya registrado.' });
    }

    const contraseñaGenerada = generarContraseña();

    console.log("Contraseña generada para el nuevo usuario:", contraseñaGenerada); // se puede eliminar en producción

    const contraseñaEncriptada = await bcrypt.hash(contraseñaGenerada, 10);


    // Crear el usuario
    const nuevoUsuario = new Usuario({
      identificacion,
      nombreCompleto,
      cargo,
      correo,
      rol,
      estado,
      proyectosAsignados,
      contraseña: contraseñaEncriptada
    });

    await nuevoUsuario.save();

// Enviar correo con la contraseña generada
    await enviarCorreo(
  correo,
  'Acceso al sistema ProElec',
  `
  <p>Hola ${nombreCompleto},</p>
  <p>Tu cuenta en el sistema <strong>ProElec</strong> ha sido creada exitosamente.</p>
  <p>Tu contraseña temporal es:</p>
  <h3>${contraseñaGenerada}</h3>
  <p>Por favor, inicia sesión y cámbiala al primer ingreso.</p>
  <p>Gracias,<br>Equipo de desarrollo ProElec</p>
  `
);

return res.status(201).json({ mensaje: "Usuario creado con éxito. La contraseña ha sido enviada por correo." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario.' });
  }
};

// Función para consultar usuario
const consultarUsuarios = async (req, res) => {
  try {
    // Desestructuramos los parámetros que llegan por la URL
    const {
      busqueda = '',        // texto ingresado en la barra de búsqueda
      rol,                  // filtro por rol (opcional)
      estado,               // filtro por estado (opcional: 'true' o 'false')
      ordenar = 'asc',      // 'asc' o 'desc' (opcional)
      pagina = 1,           // número de página actual (default: 1)
      limite = 10           // número de resultados por página (default: 10)
    } = req.query;

    // Creamos una expresión regular para búsqueda insensible a mayúsculas
    const regex = new RegExp(busqueda, 'i');

    // Iniciamos los filtros de búsqueda
    const filtros = {};

    // Si se ingresó un texto, buscamos por nombre o identificación
    if (busqueda.trim() !== '') {
      filtros.$or = [
        { nombreCompleto: regex },
        { identificacion: regex }
      ];
    }

    // Si se especificó un rol, lo añadimos al filtro
    if (rol) {
      filtros.rol = rol;
    }

    // Si el estado no viene como undefined, lo convertimos a booleano
    if (estado !== undefined) {
      filtros.estado = estado === 'true';
    }

    // Cálculo para paginación: cuántos documentos debemos saltar
    const skip = (parseInt(pagina) - 1) * parseInt(limite);

    // Convertimos el orden en número: 1 para ascendente, -1 para descendente
    const orden = ordenar === 'desc' ? -1 : 1;

    // Buscamos los usuarios según los filtros aplicados
    const usuarios = await Usuario.find(filtros)
      .sort({ nombreCompleto: orden })      // ordenamos por nombre
      .skip(skip)                           // saltamos N usuarios según la página
      .limit(parseInt(limite))              // limitamos la cantidad por página
      .select('-contraseña');               // excluimos la contraseña por seguridad

    // Contamos cuántos usuarios coinciden en total
    const total = await Usuario.countDocuments(filtros);

    // Respondemos con los datos en formato paginado
    res.json({
      total,                                 // total de usuarios que cumplen los filtros
      pagina: parseInt(pagina),              // número de página actual
      totalPaginas: Math.ceil(total / limite), // total de páginas
      usuarios                               // arreglo de usuarios encontrados
    });

  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios.' });
  }
};

// Función para autocompletar usuarios por nombre o identificación
const autocompletarUsuarios = async (req, res) => {
  try {
    const termino = req.query.termino?.toString() || '';

    if (!termino.trim()) {
      return res.status(400).json({ mensaje: 'Debe enviar un término de búsqueda.' });
    }

    const regex = new RegExp(termino, 'i'); // 'i' ignora mayúsculas/minúsculas

    // Solo se devuelven campos básicos, máximo 10 resultados
    const usuarios = await Usuario.find({
      $or: [
        { nombreCompleto: regex },
        { identificacion: regex }
      ]
    })
      .select('nombreCompleto identificacion')  // No se devuelve toda la info
      .limit(10); // Máximo 10 resultados para que sea rápido

    res.json(usuarios);

  } catch (error) {
    console.error('Error en autocompletar:', error);
    res.status(500).json({ mensaje: 'Error al autocompletar usuarios.' });
  }
};

// Función para editar un usuario
const editarUsuario = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID desde la URL
  const {
    nombreCompleto,
    cargo,
    correo,
    rol,
    estado,
    proyectosAsignados
  } = req.body;

  try {
    // Validación básica: verificar campos requeridos
    if (
      !nombreCompleto || !cargo || !correo ||
      !rol || typeof estado === 'undefined' ||
      !Array.isArray(proyectosAsignados) || proyectosAsignados.length === 0
    ) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Verificamos si el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Validamos si se intenta cambiar el correo a uno ya registrado
    if (usuario.correo !== correo) {
      const correoExistente = await Usuario.findOne({ correo });
      if (correoExistente) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado por otro usuario.' });
      }
    }

    // Actualizamos los campos permitidos
    usuario.nombreCompleto = nombreCompleto;
    usuario.cargo = cargo;
    usuario.correo = correo;
    usuario.rol = rol;
    usuario.estado = estado;
    usuario.proyectosAsignados = proyectosAsignados;

    await usuario.save();

    res.json({ mensaje: 'Usuario actualizado correctamente.' });

  } catch (error) {
    console.error('Error al editar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario.' });
  }
};

// cambiar estado usuario
const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;           // Extrae el ID del usuario desde la URL
    const { estado } = req.body;         // Extrae el nuevo estado desde el body

    // Verifica que se haya enviado estado
    if (typeof estado === 'undefined') {
      return res.status(400).json({ mensaje: 'Debe proporcionar el nuevo estado (true o false).' });
    }

    // Buscar usuario
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Actualizar estado
    usuario.estado = estado;
    await usuario.save();

    res.json({
      mensaje: `Usuario ${estado ? 'activado' : 'inhabilitado'} correctamente.`
    });
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    res.status(500).json({ mensaje: 'Error al cambiar el estado del usuario.' });
  }
};


// Eliminar completamente un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    await Usuario.findByIdAndDelete(id);

    res.json({ mensaje: 'Usuario eliminado permanentemente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario.' });
  }
};


module.exports = {
  crearUsuario,
  consultarUsuarios,
  autocompletarUsuarios,
  editarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario
};