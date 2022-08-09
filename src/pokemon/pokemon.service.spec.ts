import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { getModelToken } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('PokemonService', () => {
  const pokemon: Pokemon = <Pokemon>{
    name: 'Pikachu',
    no: 1,
  };
  let service: PokemonService;
  let model: Model<Pokemon>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getModelToken(Pokemon.name),
          useValue: Pokemon,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    model = module.get<Model<Pokemon>>(getModelToken(Pokemon.name));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return a pokemon find by no', async () => {
    model.findOne = jest.fn().mockResolvedValue(pokemon);
    expect(await service.findOne('1')).toEqual(pokemon);
  });

  it('should be return a pokemon find by name', async () => {
    model.findOne = jest.fn().mockResolvedValue(pokemon);
    expect(await service.findOne('test')).toEqual(pokemon);
  });

  it('should be return a pokemon find by id', async () => {
    model.findById = jest.fn().mockResolvedValue(pokemon);
    expect(await service.findOne('62ed99598aace24fc7864e0c')).toEqual(pokemon);
  });

  it('should be return a error', async () => {
    model.findOne = jest.fn().mockResolvedValue(undefined);
    await expect(service.findOne('1')).rejects.toThrowError(NotFoundException);
  });

  it('should be created a pokemon', async () => {
    model.create = jest.fn().mockResolvedValue(pokemon);
    expect(await service.create(pokemon)).toEqual(pokemon);
    expect(model.create).toBeCalledTimes(1);
  });
});
