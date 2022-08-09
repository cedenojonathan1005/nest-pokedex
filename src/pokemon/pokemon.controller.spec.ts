import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { getModelToken } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { NotFoundException } from '@nestjs/common';

describe('PokemonController', () => {
  const pokemon: Pokemon = <Pokemon>{
    name: 'Pikachu',
    no: 1,
  };
  const updatePokemon: Pokemon = <Pokemon>{
    name: 'Charizard',
    no: 1,
  };
  let controller: PokemonController;
  let pokemonService: PokemonService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        PokemonService,
        {
          provide: getModelToken(Pokemon.name),
          useValue: Pokemon,
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    pokemonService = module.get<PokemonService>(PokemonService);
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return one pokemon', async () => {
    jest
      .spyOn(pokemonService, 'findOne')
      .mockImplementation((): Promise<Pokemon> => Promise.resolve(pokemon));
    expect(await controller.findOne('test')).toEqual(pokemon);
  });

  it('should return a error', async () => {
    jest
      .spyOn(pokemonService, 'findOne')
      .mockRejectedValue(new NotFoundException('Pokemon does not exists'));
    await expect(controller.findOne('test')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should return updated pokemon', async () => {
    jest
      .spyOn(pokemonService, 'update')
      .mockImplementation(
        (): Promise<Pokemon> => Promise.resolve(updatePokemon),
      );
    expect(await controller.update('test', {})).toEqual(updatePokemon);
  });

  it('should return a error', async () => {
    jest
      .spyOn(pokemonService, 'update')
      .mockRejectedValue(new NotFoundException('Pokemon does not exists'));
    await expect(controller.update('test', updatePokemon)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should remove pokemon', async () => {
    jest
      .spyOn(pokemonService, 'remove')
      .mockImplementation((): Promise<boolean> => Promise.resolve(true));
    expect(await controller.remove('test')).toEqual(true);
  });

  it('should return a error', async () => {
    jest
      .spyOn(pokemonService, 'remove')
      .mockRejectedValue(new NotFoundException('Pokemon does not exists'));
    await expect(controller.remove('test')).rejects.toThrowError(
      NotFoundException,
    );
  });
  it('should return all pokemon', () => {
    jest.spyOn(pokemonService, 'findAll');
    expect(controller.findAll()).toEqual('This action returns all pokemon');
  });

  it('should create a pokemon', async () => {
    jest
      .spyOn(pokemonService, 'create')
      .mockImplementation((): Promise<Pokemon> => Promise.resolve(pokemon));
    expect(await controller.create(pokemon)).toEqual(pokemon);
  });

  it('should return a error', async () => {
    jest
      .spyOn(pokemonService, 'create')
      .mockRejectedValue(new NotFoundException('Pokemon does not exists'));
    await expect(controller.create(pokemon)).rejects.toThrowError(
      NotFoundException,
    );
  });
});
