import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { FLIGHT } from 'src/common/models/models';
import { FlightDTO } from './dto/flight.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}
  async create(flightDTO: FlightDTO): Promise<IFlight> {
    const newFligth = new this.model(flightDTO);
    return await newFligth.save();
  }
  async findAll(): Promise<IFlight[]> {
    return await this.model.find().populate('passengers');
  }
  async findOne(id: string): Promise<IFlight> {
    return await this.model.findById(id).populate('passengers');
  }
  async update(id: string, flightDTO: FlightDTO): Promise<IFlight> {
    return await this.model.findByIdAndUpdate(id, flightDTO, { new: true });
  }
  async delete(id: string): Promise<any> {
    await this.model.findByIdAndDelete(id);
    return { status: HttpStatus.OK, message: 'Flight deleted' };
  }
  async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
    return this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: { passengers: passengerId as any },
        },
        { new: true },
      )
      .populate('passengers');
  }
}
