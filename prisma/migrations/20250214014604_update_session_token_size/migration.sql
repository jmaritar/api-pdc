-- AlterTable
ALTER TABLE `Session` MODIFY `token` VARCHAR(255) NOT NULL,
    MODIFY `refresh_token` VARCHAR(255) NOT NULL;
