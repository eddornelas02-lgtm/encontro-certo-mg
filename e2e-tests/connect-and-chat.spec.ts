import { test, expect } from "@playwright/test";

test("conectar com um perfil de Minas e conversar no modo Amor", async ({ page }) => {
  await page.goto("/");

  // O app abre por padrão no modo Amor, na aba Descobrir, mostrando um perfil de MG
  await expect(
    page.getByRole("heading", { name: "Carolina Rezende, 26" })
  ).toBeVisible();

  // Curtir o perfil revela a confirmação de encontro
  await page.getByRole("button", { name: "Dar like" }).click();
  await expect(
    page.getByRole("heading", { name: "Deu Encontro Certo!" })
  ).toBeVisible();

  // Abrir a conversa com a nova partida
  await page.getByRole("button", { name: "Abrir Conversa Agora" }).click();

  // A conversa abre com a mensagem inicial da outra pessoa
  await expect(
    page
      .getByText("Oi! Que bom que deu certo o nosso encontro por aqui em Belo Horizonte! Como está seu dia?")
      .first()
  ).toBeVisible();

  // Enviar uma mensagem e vê-la aparecer na conversa
  const input = page.getByPlaceholder("Escreva uma mensagem carinhosa...");
  await input.fill("Oi Carolina! Vamos tomar um café no Mercado Central?");
  await input.press("Enter");

  await expect(
    page.getByText("Oi Carolina! Vamos tomar um café no Mercado Central?").first()
  ).toBeVisible();
});
