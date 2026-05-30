-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'LIDER', 'MEMBRO') NOT NULL DEFAULT 'MEMBRO',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `igrejaId` INTEGER NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paises` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `paises_sigla_key`(`sigla`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `paisId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `igrejas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cidadeId` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `igrejaId` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `ordemRodizio` INTEGER NOT NULL DEFAULT 0,
    `setorId` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_culto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `horarioPadrao` VARCHAR(191) NOT NULL,
    `diasSemana` VARCHAR(191) NOT NULL DEFAULT '[]',
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_culto_igrejas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `igrejaId` INTEGER NOT NULL,
    `tipoCultoId` INTEGER NOT NULL,
    `horario` VARCHAR(191) NULL,
    `diasSemana` VARCHAR(191) NULL,
    `observacao` VARCHAR(191) NULL,

    UNIQUE INDEX `config_culto_igrejas_igrejaId_tipoCultoId_key`(`igrejaId`, `tipoCultoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cultos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL,
    `horario` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `status` ENUM('AGENDADO', 'REALIZADO', 'CANCELADO') NOT NULL DEFAULT 'AGENDADO',
    `igrejaId` INTEGER NOT NULL,
    `tipoCultoId` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `escalas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cultoId` INTEGER NOT NULL,
    `membroId` INTEGER NOT NULL,
    `confirmado` BOOLEAN NULL,
    `notificado1Dia` BOOLEAN NOT NULL DEFAULT false,
    `notificado3Horas` BOOLEAN NOT NULL DEFAULT false,
    `observacao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `escalas_cultoId_membroId_key`(`cultoId`, `membroId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_igrejaId_fkey` FOREIGN KEY (`igrejaId`) REFERENCES `igrejas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cidades` ADD CONSTRAINT `cidades_paisId_fkey` FOREIGN KEY (`paisId`) REFERENCES `paises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `igrejas` ADD CONSTRAINT `igrejas_cidadeId_fkey` FOREIGN KEY (`cidadeId`) REFERENCES `cidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `setores` ADD CONSTRAINT `setores_igrejaId_fkey` FOREIGN KEY (`igrejaId`) REFERENCES `igrejas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membros` ADD CONSTRAINT `membros_setorId_fkey` FOREIGN KEY (`setorId`) REFERENCES `setores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `config_culto_igrejas` ADD CONSTRAINT `config_culto_igrejas_igrejaId_fkey` FOREIGN KEY (`igrejaId`) REFERENCES `igrejas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `config_culto_igrejas` ADD CONSTRAINT `config_culto_igrejas_tipoCultoId_fkey` FOREIGN KEY (`tipoCultoId`) REFERENCES `tipos_culto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cultos` ADD CONSTRAINT `cultos_igrejaId_fkey` FOREIGN KEY (`igrejaId`) REFERENCES `igrejas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cultos` ADD CONSTRAINT `cultos_tipoCultoId_fkey` FOREIGN KEY (`tipoCultoId`) REFERENCES `tipos_culto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escalas` ADD CONSTRAINT `escalas_cultoId_fkey` FOREIGN KEY (`cultoId`) REFERENCES `cultos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `escalas` ADD CONSTRAINT `escalas_membroId_fkey` FOREIGN KEY (`membroId`) REFERENCES `membros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
