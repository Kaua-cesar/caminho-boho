// src/data/produtos.js
import vestido1 from "../../assets/costa-nua-1.jpg";
import vestido2 from "../../assets/vestido2.jpg";
import vestido3 from "../../assets/vestido3.jpg";

export const produtos = [
   {
      id: "prod1",
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
      avaliacao: 2.5,
      qntavaliacoes: 2,
   },
   {
      id: "prod2",
      nome: "Vestido Vest Lenco Elegante [ EDICAO ESPECIAL ] ",

      precoOriginal: 399.99,
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
   },
   {
      id: "prod3",
      nome: "Vestido Boho Longo 2023",
      precoOriginal: 249.99,
      desconto: -25,
      categoria: "boholongo",
      cores: [
         { nome: "preto", classe: "bg-black" },
         { nome: "amarelo", classe: "bg-yellow-500" },
      ],

      tamanhos: [{ nome: "P" }, { nome: "M" }, { nome: "G" }],
      imagem: vestido3,
      avaliacao: 4.5,
      qntavaliacoes: 7,
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
      imagem:
         "https://scontent.fcaw3-1.fna.fbcdn.net/v/t51.75761-15/504158139_18306728875213518_7924141132859634593_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8IZO1dGLCb0Q7kNvwE-LXUA&_nc_oc=AdnKavPs8t-UmjxKh3-b9_2F1GG28vXuoADcEvq-6Mmb3LuLEFFv4BrMWz_R6cJxGDA&_nc_zt=23&_nc_ht=scontent.fcaw3-1.fna&_nc_gid=nAFZripRaWI2ZWU0hsj_KQ&oh=00_AfN0egprXKQaUQ0RdIJak-xrK-U0-RpG_QUU2lyFmt7oDQ&oe=685AE493",
      avaliacao: 4.6,
      qntavaliacoes: 11,
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
      imagem:
         "https://scontent.fcaw3-1.fna.fbcdn.net/v/t51.75761-15/504158139_18306728875213518_7924141132859634593_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8IZO1dGLCb0Q7kNvwE-LXUA&_nc_oc=AdnKavPs8t-UmjxKh3-b9_2F1GG28vXuoADcEvq-6Mmb3LuLEFFv4BrMWz_R6cJxGDA&_nc_zt=23&_nc_ht=scontent.fcaw3-1.fna&_nc_gid=nAFZripRaWI2ZWU0hsj_KQ&oh=00_AfN0egprXKQaUQ0RdIJak-xrK-U0-RpG_QUU2lyFmt7oDQ&oe=685AE493",
      avaliacao: 4.6,
      qntavaliacoes: 11,
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
      imagem:
         "https://scontent.fcaw3-1.fna.fbcdn.net/v/t51.75761-15/504158139_18306728875213518_7924141132859634593_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8IZO1dGLCb0Q7kNvwE-LXUA&_nc_oc=AdnKavPs8t-UmjxKh3-b9_2F1GG28vXuoADcEvq-6Mmb3LuLEFFv4BrMWz_R6cJxGDA&_nc_zt=23&_nc_ht=scontent.fcaw3-1.fna&_nc_gid=nAFZripRaWI2ZWU0hsj_KQ&oh=00_AfN0egprXKQaUQ0RdIJak-xrK-U0-RpG_QUU2lyFmt7oDQ&oe=685AE493",
      avaliacao: 4.6,
      qntavaliacoes: 11,
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
      imagem:
         "https://scontent.fcaw3-1.fna.fbcdn.net/v/t51.75761-15/504158139_18306728875213518_7924141132859634593_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8IZO1dGLCb0Q7kNvwE-LXUA&_nc_oc=AdnKavPs8t-UmjxKh3-b9_2F1GG28vXuoADcEvq-6Mmb3LuLEFFv4BrMWz_R6cJxGDA&_nc_zt=23&_nc_ht=scontent.fcaw3-1.fna&_nc_gid=nAFZripRaWI2ZWU0hsj_KQ&oh=00_AfN0egprXKQaUQ0RdIJak-xrK-U0-RpG_QUU2lyFmt7oDQ&oe=685AE493",
      avaliacao: 4.6,
      qntavaliacoes: 11,
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
   },
   // Adicione os outros produtos aqui
];
