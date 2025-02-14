import { IsNotEmpty, IsNumber } from 'class-validator';
import { TicketStatus } from 'src/shared/enums/common.interface';

export class UpdateTicketStatusDto {
  @IsNotEmpty()
  @IsNumber()
  status: TicketStatus;
}
