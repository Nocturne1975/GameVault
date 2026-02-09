"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GameStatus, Platform } from "@/generated/prisma/client";

export interface GameFormData{
    title:string;
    platform: Platform;
    status: GameStatus;
    rating?: number | null;
    imageUrl?: string | null;
    isPublic?: boolean;
}

export async function addGame(data: GameFormData){
    const { userId } = await auth();

    if(!userId){
        throw new Error("Vous devez être connecté pour ajouter un jeu.")
    }

    if (!data.title || data.title.trim().length < 2) {
    throw new Error("Le titre du jeu doit contenir au moins 2 caractères.");
  }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw new Error("La note doit être comprise entre 1 et 5.");
    }

    const newGame = await prisma.game.create({
        data: {
            title: data.title.trim(),
            platform: data.platform,
            status:data.status,
            rating:data.rating,
            imageUrl:data.imageUrl,
            isPublic: data.isPublic,
            userId:userId,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/explore");

    return newGame;
}

export async function getUserGames(){
    const { userId } = await auth();
    
    if(!userId){
        return[];
    }

    return await prisma.game.findMany({
        where: {userId: userId},
        orderBy: {createdAt: "desc"},
    });
}

export async function updateGame(gameId: number, data: Partial<GameFormData>) {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Non autorisé : Session expirée.");
  }

  const game = await prisma.game.findUnique({
    where: {id:gameId},
  });

  if (!game || game.userId !== userId){
    throw new Error("Jeu non trouvé ou vous n'avez pas les droits de modification.");
  }

  const updated = await prisma.game.update({
    where: { id: gameId },
    data: {
      ...data,
      title: data.title?.trim(),
    },
  });

  revalidatePath("/dashboard");
  return updated;
}

export async function deleteGame(gameId: number) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Non autorisé");
    }

    const game = await prisma.game.findUnique({
    where: {id:gameId},
    });

    if (!game || game.userId !== userId){
        throw new Error("Jeu non trouvé ou vous n'avez pas les droits de supprission.");
    }

    await prisma.game.delete({
        where: {id: gameId},
    });

    revalidatePath("/dashboard");
    revalidatePath("/explore");
}

export async function getPublicGames() {
  return await prisma.game.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 10, 
  });
}