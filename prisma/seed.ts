import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...\n')

  // ─── País ────────────────────────────────────────────────────
  const brasil = await prisma.pais.upsert({
    where: { sigla: 'BR' },
    update: {},
    create: { nome: 'Brasil', sigla: 'BR' },
  })
  console.log('✅ País criado:', brasil.nome)

  // ─── Cidades ─────────────────────────────────────────────────
  const maringa = await prisma.cidade.upsert({
    where: { id: 1 },
    update: {},
    create: { nome: 'Maringá', paisId: brasil.id },
  })

  const sarandi = await prisma.cidade.upsert({
    where: { id: 2 },
    update: {},
    create: { nome: 'Sarandi', paisId: brasil.id },
  })
  console.log('✅ Cidades criadas:', maringa.nome, '|', sarandi.nome)

  // ─── Igrejas ─────────────────────────────────────────────────
  const igrejaMaringa = await prisma.igreja.upsert({
    where: { id: 1 },
    update: {},
    create: { nome: 'Igreja Central Maringá', cidadeId: maringa.id },
  })

  const igrejaSarandi = await prisma.igreja.upsert({
    where: { id: 2 },
    update: {},
    create: { nome: 'Igreja Central Sarandi', cidadeId: sarandi.id },
  })
  console.log('✅ Igrejas criadas:', igrejaMaringa.nome, '|', igrejaSarandi.nome)

  // ─── Tipos de culto ──────────────────────────────────────────
  // diasSemana: 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  const cultoOficial = await prisma.tipoCulto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: 'Culto Oficial',
      horarioPadrao: '19:30',
      diasSemana: JSON.stringify([2, 6, 0]), // terça, sábado, domingo
    },
  })

  const reuniaoJovens = await prisma.tipoCulto.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: 'Reunião de Jovens e Menores',
      horarioPadrao: '10:00',
      diasSemana: JSON.stringify([0]), // domingo
    },
  })

  const ensaio = await prisma.tipoCulto.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nome: 'Ensaio',
      horarioPadrao: '19:30',
      diasSemana: JSON.stringify([2]), // terça
    },
  })

  const ensaioTecnico = await prisma.tipoCulto.upsert({
    where: { id: 4 },
    update: {},
    create: {
      nome: 'Ensaio Técnico',
      horarioPadrao: '19:30',
      diasSemana: JSON.stringify([6]), // sábado
    },
  })
  console.log('✅ Tipos de culto criados: Culto Oficial | Reunião de Jovens | Ensaio | Ensaio Técnico')

  // ─── Config especial: Culto Oficial domingo em Maringá = 18:30
  await prisma.configCultoIgreja.upsert({
    where: {
      igrejaId_tipoCultoId: {
        igrejaId: igrejaMaringa.id,
        tipoCultoId: cultoOficial.id,
      },
    },
    update: {},
    create: {
      igrejaId: igrejaMaringa.id,
      tipoCultoId: cultoOficial.id,
      horario: '18:30',
      observacao: 'Culto Oficial de domingo em Maringá começa às 18:30',
    },
  })
  console.log('✅ Config especial: Culto Oficial Maringá domingo → 18:30')

  // ─── Setores ─────────────────────────────────────────────────
  // Criando os mesmos setores para as duas igrejas
  const setoresSarandi = await Promise.all([
    prisma.setor.upsert({
      where: { id: 1 },
      update: {},
      create: { nome: 'Som', igrejaId: igrejaSarandi.id },
    }),
    prisma.setor.upsert({
      where: { id: 2 },
      update: {},
      create: { nome: 'Organistas', igrejaId: igrejaSarandi.id },
    }),
    prisma.setor.upsert({
      where: { id: 3 },
      update: {},
      create: { nome: 'Porteiros', igrejaId: igrejaSarandi.id },
    }),
    prisma.setor.upsert({
      where: { id: 4 },
      update: {},
      create: { nome: 'Irmãos do Pátio', igrejaId: igrejaSarandi.id },
    }),
    prisma.setor.upsert({
      where: { id: 5 },
      update: {},
      create: { nome: 'Banheiro', igrejaId: igrejaSarandi.id },
    }),
    prisma.setor.upsert({
      where: { id: 6 },
      update: {},
      create: { nome: 'Porteirinhos', igrejaId: igrejaSarandi.id },
    }),
  ])

  const setoresMaringa = await Promise.all([
    prisma.setor.upsert({
      where: { id: 7 },
      update: {},
      create: { nome: 'Som', igrejaId: igrejaMaringa.id },
    }),
    prisma.setor.upsert({
      where: { id: 8 },
      update: {},
      create: { nome: 'Organistas', igrejaId: igrejaMaringa.id },
    }),
    prisma.setor.upsert({
      where: { id: 9 },
      update: {},
      create: { nome: 'Porteiros', igrejaId: igrejaMaringa.id },
    }),
  ])
  console.log('✅ Setores criados para Sarandi e Maringá')

  // ─── Membros do setor de Som em Sarandi ──────────────────────
  const setorSomSarandi = setoresSarandi[0] // Som = índice 0
  await prisma.membro.createMany({
    skipDuplicates: true,
    data: [
      { nome: 'João Silva',    telefone: '5544999990001', ordemRodizio: 1, setorId: setorSomSarandi.id },
      { nome: 'Maria Santos',  telefone: '5544999990002', ordemRodizio: 2, setorId: setorSomSarandi.id },
      { nome: 'Pedro Costa',   telefone: '5544999990003', ordemRodizio: 3, setorId: setorSomSarandi.id },
      { nome: 'Ana Oliveira',  telefone: '5544999990004', ordemRodizio: 4, setorId: setorSomSarandi.id },
    ],
  })
  console.log('✅ Membros do Som (Sarandi) criados')

  // ─── Usuário admin ────────────────────────────────────────────
  const senhaHash = await bcrypt.hash('admin123', 10)

  await prisma.usuario.upsert({
    where: { email: 'superadmin@sistema.com' },
    update: {},
    create: {
      nome: 'Super Admin',
      email: 'superadmin@sistema.com',
      senha: await bcrypt.hash('super123', 10),
      role: 'SUPER_ADMIN',
      // SUPER_ADMIN não tem igrejaId
    },
  })

  await prisma.usuario.upsert({
    where: { email: 'admin@sarandi.com' },
    update: {},
    create: {
      nome: 'Admin Sarandi',
      email: 'admin@sarandi.com',
      senha: senhaHash,
      role: 'ADMIN',
      igrejaId: igrejaSarandi.id,
    },
  })

  await prisma.usuario.upsert({
    where: { email: 'admin@maringa.com' },
    update: {},
    create: {
      nome: 'Admin Maringá',
      email: 'admin@maringa.com',
      senha: senhaHash,
      role: 'ADMIN',
      igrejaId: igrejaMaringa.id,
    },
  })

  await prisma.usuario.upsert({
    where: { email: 'lider.som@sarandi.com' },
    update: {},
    create: {
      nome: 'Líder do Som',
      email: 'lider.som@sarandi.com',
      senha: senhaHash,
      role: 'LIDER',
      igrejaId: igrejaSarandi.id,
    },
  })
  console.log('✅ Usuários criados')

  // ─── Cultos de exemplo (junho 2025) ──────────────────────────
  // Terças de junho: 3, 10, 17, 24
  // Sábados de junho: 7, 14, 21, 28
  // Domingos de junho: 1, 8, 15, 22, 29
  const cultosSarandi = [
    { data: new Date('2025-06-03'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-07'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-08'), horario: '10:00', tipoCultoId: reuniaoJovens.id },
    { data: new Date('2025-06-08'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-10'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-14'), horario: '19:30', tipoCultoId: ensaioTecnico.id },
    { data: new Date('2025-06-15'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-17'), horario: '19:30', tipoCultoId: ensaio.id },
    { data: new Date('2025-06-21'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-22'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-24'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-28'), horario: '19:30', tipoCultoId: cultoOficial.id },
    { data: new Date('2025-06-29'), horario: '19:30', tipoCultoId: cultoOficial.id },
  ]

  for (const culto of cultosSarandi) {
    await prisma.culto.create({
      data: { ...culto, igrejaId: igrejaSarandi.id },
    })
  }
  console.log(`✅ ${cultosSarandi.length} cultos de junho criados para Sarandi`)

  // ─── Resumo ───────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎉 Seed concluído! Acesse com:')
  console.log('')
  console.log('  Super Admin → superadmin@sistema.com / super123')
  console.log('  Admin Sarandi → admin@sarandi.com   / admin123')
  console.log('  Admin Maringá → admin@maringa.com   / admin123')
  console.log('  Líder Som    → lider.som@sarandi.com / admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())