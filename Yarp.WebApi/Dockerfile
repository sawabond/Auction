FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 5167
EXPOSE 7112

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Yarp.WebApi/Yarp.WebApi.csproj", "Yarp.WebApi/"]
RUN dotnet restore "Yarp.WebApi/Yarp.WebApi.csproj"
COPY . .
WORKDIR "/src/Yarp.WebApi"
RUN dotnet build "Yarp.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Yarp.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Yarp.WebApi.dll"]
