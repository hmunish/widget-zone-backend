import { TicketManagement } from 'src/shared/dto/widgets/ticket-management.dto';
import {
  Advertisement,
  Newsletter,
} from 'src/shared/interfaces/user-widget.interface';

export function fillNewsletterTemplate(
  widgetData: Newsletter,
  template: string,
  widgetHostname: string,
) {
  return template
    .replace(/__BG_COLOR__/g, widgetData.styles.bgColor)
    .replace(/__COLOR__/g, widgetData.styles.color)
    .replace(/__TITLE__/g, widgetData.title)
    .replace(/__MESSAGE__/g, widgetData.message)
    .replace(/__HOSTNAME__/g, widgetHostname);
}

export function fillAdvertisementTemplate(
  widgetData: Advertisement,
  template: string,
) {
  return template.replace(/__IMG_URL__/g, widgetData.image.url);
}

export function fillTicketManagementTemplate(
  widgetData: TicketManagement,
  template: string,
  widgetHostname: string,
) {
  return template
    .replace(/__BG_COLOR__/g, widgetData.styles.bgColor)
    .replace(/__COLOR__/g, widgetData.styles.color)
    .replace(/__TITLE__/g, widgetData.title)
    .replace(/__MESSAGE__/g, widgetData.message)
    .replace(/__HOSTNAME__/g, widgetHostname);
}
