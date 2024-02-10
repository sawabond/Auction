FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Auth.PollingPublisher/Auth.PollingPublisher.csproj", "Auth.PollingPublisher/"]
RUN dotnet restore "Auth.PollingPublisher/Auth.PollingPublisher.csproj"
COPY . .
WORKDIR "/src/Auth.PollingPublisher"
RUN dotnet build "Auth.PollingPublisher.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Auth.PollingPublisher.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Auth.PollingPublisher.dll"]
