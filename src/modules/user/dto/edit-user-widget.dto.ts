import { IsNotEmpty, ValidateNested, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Newsletter } from 'src/shared/dto/widgets/newsletter.dto';
import { Advertisement } from 'src/shared/dto/widgets/advertisement.dto';
import { TicketManagement } from 'src/shared/dto/widgets/ticket-management.dto';

const TypeToDtoMap = {
  newsletter: Newsletter,
  advertisement: Advertisement,
  'ticket-management': TicketManagement,
};

export class WidgetType {
  @IsNotEmpty()
  id: ObjectId;

  @IsNotEmpty()
  @IsIn(Object.keys(TypeToDtoMap), {
    message: `Name must be one of: ${Object.keys(TypeToDtoMap).join(', ')}`,
  })
  name: keyof typeof TypeToDtoMap;
}

export class EditUserWidgetDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WidgetType)
  type: WidgetType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(
    (options) => TypeToDtoMap[(options.object as EditUserWidgetDto).type.name],
  )
  data: Newsletter | Advertisement | TicketManagement;
}
