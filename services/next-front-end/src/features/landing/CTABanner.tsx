const CTABanner = (props: {
  title: string;
  description: string;
  buttons: React.ReactNode;
}) => (
  <div className="rounded-xl bg-muted bg-gradient-to-br from-green-400 via-green-500 to-green-600 px-6 py-10 text-center">
    <div className="text-3xl font-bold text-primary-foreground">
      {props.title}
    </div>

    <div className="mt-2 text-lg font-medium text-muted">
      {props.description}
    </div>

    <div className="mt-6">{props.buttons}</div>
  </div>
);

export { CTABanner };
