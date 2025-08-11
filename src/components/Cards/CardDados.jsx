// src/data/produtos.js
import vestido1 from "../../assets/costa-nua-1.jpg";
import vestido2 from "../../assets/vestido2.jpg";
import vestido3 from "../../assets/vestido3.jpg";

export const produtos = [
   {
      id: "prod1",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 0.09,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 2.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Era estoque: 0, então uma combinação terá 0.
      estoque: {
         Verde: { S: 1, M: 0, G: 0, GG: 0 }, // Exemplo: Verde G indisponível
         Roxo: { S: 0, M: 0, G: 0, GG: 0 },
         Rosa: { S: 0, M: 0, G: 0, GG: 0 },
      },
   },
   {
      id: "prod2",
      nome: "Vestido Vest Lenco Elegante [ EDICAO ESPECIAL ] ",
      precoOriginal: 11.11,
      categoria: "vestlenco",
      cores: [
         { nome: "Azul", classe: "bg-blue-500" },
         { nome: "Verde", classe: "bg-green-600" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "P" }, { nome: "M" }, { nome: "G" }],
      imagem: vestido2,
      avaliacao: 1.7,
      qntavaliacoes: 10,
      // ✨ ATUALIZADO: Estoque por variação. Era estoque: 1.
      estoque: {
         Azul: { P: 1, M: 0, G: 1 }, // Exemplo: Azul M indisponível
         Verde: { P: 2, M: 1, G: 2 },
      },
   },
   {
      id: "prod3",
      nome: "Vestido Boho Longo 2023",
      precoOriginal: 2.99,
      desconto: -25,
      categoria: "boholongo",
      cores: [
         { nome: "Preto", classe: "bg-black" },
         { nome: "Amarelo", classe: "bg-yellow-500" },
      ],
      tamanhos: [{ nome: "P" }, { nome: "M" }, { nome: "G" }],
      imagem: vestido3,
      avaliacao: 4.5,
      qntavaliacoes: 7,
      // ✨ ATUALIZADO: Estoque por variação. Era estoque: 2.
      estoque: {
         Preto: { P: 2, M: 1, G: 0 }, // Exemplo: Preto G indisponível
         Amarelo: { P: 3, M: 2, G: 1 },
      },
   },
   {
      id: "prod4",
      nome: "Vestido Boho Chic Elegante",
      precoOriginal: 399.99,
      categoria: "bohochic",
      cores: [
         { nome: "Azul", classe: "bg-blue-500" },
         { nome: "Verde", classe: "bg-green-600" },
      ],
      desconto: null,
      tamanhos: [{ nome: "P" }, { nome: "M" }, { nome: "G" }],
      imagem: vestido3,
      avaliacao: 4.6,
      qntavaliacoes: 11,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Azul: { P: 2, M: 2, G: 2 },
         Verde: { P: 2, M: 2, G: 2 },
      },
   },
   {
      id: "prod5",
      nome: "Vestido Boho Chic Elegante",
      precoOriginal: 399.99,
      categoria: "bohochic",
      cores: [
         { nome: "Azul", classe: "bg-blue-500" },
         { nome: "Verde", classe: "bg-green-600" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "P" }, { nome: "M" }, { nome: "G" }],
      imagem: vestido3,
      avaliacao: 4.6,
      qntavaliacoes: 11,
      // ✨ ATUALIZADO: Estoque por variação. Era estoque: 0, então uma combinação terá 0.
      estoque: {
         Azul: { P: 1, M: 0, G: 1 }, // Exemplo: Azul M indisponível
         Verde: { P: 1, M: 1, G: 0 }, // Exemplo: Verde G indisponível
      },
   },
   {
      id: "prod6",
      nome: "Vestido Boho Chic Elegante",
      precoOriginal: 399.99,
      categoria: "bohochic",
      cores: [
         { nome: "Azul", classe: "bg-blue-500" },
         { nome: "Verde", classe: "bg-green-600" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "P" }, { nome: "M" }, { nome: "G" }],
      imagem: vestido3,
      avaliacao: 4.6,
      qntavaliacoes: 11,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Azul: { P: 2, M: 2, G: 2 },
         Verde: { P: 2, M: 2, G: 2 },
      },
   },
   {
      id: "prod7",
      nome: "Vestido Boho Chic Elegante",
      precoOriginal: 399.99,
      categoria: "bohochic",
      cores: [
         { nome: "Azul", classe: "bg-blue-500" },
         { nome: "Verde", classe: "bg-green-600" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "P" }, { nome: "M" }, { nome: "G" }],
      imagem: vestido3,
      avaliacao: 4.6,
      qntavaliacoes: 11,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Azul: { P: 2, M: 2, G: 2 },
         Verde: { P: 2, M: 2, G: 2 },
      },
   },
   {
      id: "prod8",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod9",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod10",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod11",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod12",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod13",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod14",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod15",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod16",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
   {
      id: "prod17",
      nome: "Vestido Costa Nua Longo",
      precoOriginal: 629.99,
      categoria: "costanua",
      cores: [
         { nome: "Verde", classe: "bg-green-500" },
         { nome: "Roxo", classe: "bg-purple-600" },
         { nome: "Rosa", classe: "bg-pink-500" },
      ],
      desconto: -25,
      tamanhos: [{ nome: "S" }, { nome: "M" }, { nome: "G" }, { nome: "GG" }],
      imagem: vestido1,
      avaliacao: 4.5,
      qntavaliacoes: 2,
      // ✨ ATUALIZADO: Estoque por variação. Assumindo estoque genérico de 2 para todas as variações.
      estoque: {
         Verde: { S: 2, M: 2, G: 2, GG: 2 },
         Roxo: { S: 2, M: 2, G: 2, GG: 2 },
         Rosa: { S: 2, M: 2, G: 2, GG: 2 },
      },
   },
];
