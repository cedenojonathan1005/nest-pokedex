import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonInsert } from './interfaces/pokemon-insert.interfaces';
import { PokeResponse } from './interfaces/pokemon-resp.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}
  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon/?limit=400',
    );
    const pokemonInsert: PokemonInsert[] = [];
    data.results.forEach(({ name, url }) => {
      const segment: string[] = url.split('/');
      const no: number = +segment[segment.length - 2];
      pokemonInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonInsert);
    return 'Seed execute';
  }
}
