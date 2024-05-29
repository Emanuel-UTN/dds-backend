// Configurar ORM Sequelize
import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize("sqlite:" + "./.data/pymes.db");

// Definicion del modelo de datos
const articulos_familias = sequelize.define(
    'articulos_familias',
    {
        IdArticuloFamilia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            // todo evitar que string autocomplete con espacios en blanco, deberia ser varchar sin espacios
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Nombre es requerido"
                },
                len: {
                    args: [5, 30],
                    msg: "Nombre debe tener entre 5 y 30 caracteres"
                },
            },
        },
    },
    {
        // pasar a mayusculas
        hooks: {
            beforeValidate: (articuloFamilia, options) => {
                if(typeof articuloFamilia.Nombre === "string")
                    articuloFamilia.Nombre = articuloFamilia.Nombre.toUpperCase().trim();
            },
        },
        timestamps: false
    }
);

const articulos = sequelize.define(
    "articulos",
    {
        IdArticulo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Nombre es requerido"
                },
                len: {
                    args: [5, 60],
                    msg: "Nombre debe tener entre 5 y 60 caracteres"
                },
            },
            unique: {
                args: true,
                msg: "Nombre ya existe"
            },
        },
        Precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Precio es requerido"
                },
            },
        },
        CodigoDeBarra: {
            type: DataTypes.STRING(13),
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Codigo de barra es requerido"
                },
                is: {
                    args: ["^[0-9]{13}$", "i"],
                    msg: "Codigo de barra debe tener 13 digitos"
                },
            },
        },
        IdArticuloFamilia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "IdArticuloFamilia es requerida"
                },
            },
        },
        Stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Stock es requerido"
                },
            },
        },
        FechaAlta: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Fecha de alta es requerida"
                },
            },
        },
        Activo:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Activo es requerido"
                },
            },
        }
    },
    {
        // pasar a mayusculas
        hooks: {
            beforeValidate: (articulo, options) => {
                if(typeof articulo.Nombre === "string")
                    articulo.Nombre = articulo.Nombre.toUpperCase().trim();
            },
        },

        timestamps: false
    }
);

export default { sequelize, articulos_familias, articulos };