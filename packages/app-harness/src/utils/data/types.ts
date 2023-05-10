export type Asset = {
    adult?: boolean;
    backdropPath?: string;
    genreIds?: Array<number>;
    id: number | string;
    // Currently supported only 3 languages, might need to add more.
    originalLanguage?: 'en' | 'es' | 'lt';
    originalTitle?: string;
    overview?: string;
    popularity?: number;
    posterPath?: string;
    releaseDate?: string | Date;
    title: string;
    subtitle?: string;
    video?: boolean;
    voteAverage?: number;
    voteCount?: number;
    image: string;
    description: string;
    type: CARD_TYPES;
};

export type DefaultAsset = {
    id: number | string;
    title: string;
    image: string;
    description: string;
    type: CARD_TYPES;
    subtitle?: string;
};

export type OriginalAsset = {
    adult?: boolean;
    backdropPath?: string;
    genreIds?: Array<number>;
    id: number | string;
    // Currently supported only 3 languages, might need to add more.
    originalLanguage?: 'en' | 'es' | 'lt';
    originalTitle?: string;
    overview: string;
    popularity?: number;
    posterPath?: string;
    releaseDate?: string | Date;
    title: string;
    video: boolean;
    voteAverage?: number;
    voteCount?: number;
};

export type RowDataType = {
    items: Array<Asset>;
    title: string;
};

export type GeneratedData = Array<RowDataType>;

export enum CARD_TYPES {
    DEFAULT = 'default',
    PROGRESS = 'progress',
}
