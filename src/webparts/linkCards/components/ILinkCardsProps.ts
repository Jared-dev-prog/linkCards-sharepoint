export interface ILinkCardsProps {
  nameList: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  absoluteUrl: string;
}

export interface linkCard {
  Id?: number;
  Tool: string;
  Title: string;
  Image: string;
  BackgroundColor: string;
  LabelButton: string;
  CardSize: string;
  ButtonLink: string;
  TargetButton: string;
  baseUrl: string;
}
