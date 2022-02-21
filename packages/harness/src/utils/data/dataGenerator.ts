import originalData from './data.json';
import { Asset, CARD_TYPES } from './types';

/**
 * To Do. This file is copied from leanback. Need to refactor and adapt it more to this project
 */

const ROW_TITLES = ['Popular on Flexn', 'Trending Now', 'Documentary', 'Cartoons', 'Recommended'];
const GENRES = ['Drama', 'Action', 'Documentary', 'Cartoons', 'Historical', 'Thriller', 'Horror', 'Romance'];

function shuffleArray(array: Array<Asset>, limit: number) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array.slice(0, limit);
}

function createDefaultDataArray() {
    return originalData.map((card) => {
        return {
            id: card.id,
            image: `https://image.tmdb.org/t/p/w500${card.backdropPath}`,
            title: card.title,
            description: card.overview,
            // To Do. This is mean to match designs and does not cover all cases
            subtitle: `${card.releaseDate.substr(0, 4)} · ${
                GENRES[Math.floor(Math.random() * ROW_TITLES.length)]
            } · Movie`,
            releaseDate: card.releaseDate,
            type: CARD_TYPES.DEFAULT,
        };
    });
}

function createProgressCards(data: Array<Asset>) {
    return data.map((card) => {
        return {
            ...card,
            type: CARD_TYPES.PROGRESS,
            progress: Math.floor(Math.random() * 100) + 1,
        };
    });
}

const defaultCards = createDefaultDataArray();

// Generates data for each individual row
export function generateRowData(type?: CARD_TYPES, limit = 20) {
    switch (type) {
        case CARD_TYPES.PROGRESS:
            return shuffleArray(createProgressCards(defaultCards), limit);
        default:
            return shuffleArray(defaultCards, limit);
    }
}

// Creates an array of rows with each having it's data and title
export function generateData(type?: CARD_TYPES, rowLimit = 20, rowsLimit?: number) {
    const data: { items: Asset[]; title: string }[] = [];
    const amountOfRows = rowsLimit || Math.floor(Math.random() * 10) + 4;
    for (let i = 0; i < amountOfRows; i++) {
        const rowTitle = ROW_TITLES[Math.floor(Math.random() * ROW_TITLES.length)];
        data.push({
            items: generateRowData(type, rowLimit),
            title: rowTitle,
        });
    }
    return data;
}
